#!/usr/bin/env node
// Deterministic social slide composer (S0). Three layouts, all rendered
// from SVG with the committed brand fonts — no image generation, no
// randomness: the same spec file produces byte-similar output forever.
//
//   node scripts/social/compose.mjs <spec.json> [--out <dir>]
//
// Layouts:
//   truth    — "Sales Truths" reel: animated type on ink, 1080x1920.
//              Emits frames -> MP4 (ffmpeg) + animated webp preview.
//   quote    — "Nobody Writes This Down": article line + existing
//              illustration, 1080x1350 portrait.
//   carousel — thesis carousel: hook/body/close slides, 1080x1350 each.
import sharp from 'sharp';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';

const INK = '#0B0B0B', BONE = '#EDE7DC', EMBER = '#FF5A1F', MICRO = '#8A8A8A';
const COND = 'Barlow Condensed', MONO = 'DM Mono';

const MARK = [
  'M231.823730,630.155273 C229.436981,629.663818 228.952454,627.732056 228.075119,626.181152 C203.553680,582.833374 179.057968,539.471069 154.537582,496.122681 C138.711945,468.145325 122.853897,440.186310 107.011559,412.218353 C106.359482,411.067169 105.533882,409.953430 106.170036,408.364899 C107.570267,406.915070 109.577454,407.365204 111.257660,407.439606 C126.588425,408.118408 141.900848,407.122009 157.221542,407.092712 C158.721283,407.089844 160.222397,407.146484 161.720581,407.100739 C168.360764,406.897888 172.464340,409.117310 176.122253,415.678436 C199.474731,457.565582 222.693161,499.536896 247.005463,540.885010 C252.744690,550.645813 258.067474,560.650940 263.634338,570.514038 C264.861023,572.687317 265.298828,574.557739 263.863586,576.987427 C254.037567,593.622314 244.373291,610.352661 234.616287,627.028564 C233.961884,628.146973 232.975098,629.070923 231.823730,630.155273 Z',
  'M302.681885,508.620178 C293.969940,523.546936 285.450745,538.162476 276.114349,554.179993 C265.543518,535.485168 255.599564,517.899109 245.073486,499.283508 C266.412018,499.283508 286.370880,499.283508 306.507935,499.283508 C307.290192,503.267456 304.071716,505.391327 302.681885,508.620178 Z',
];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function markSvg(x, y, size, fill = EMBER) {
  const s = size / 238;
  return `<g transform="translate(${x},${y}) scale(${s}) translate(-98,-400)">
    ${MARK.map((d) => `<path d="${d}" fill="${fill}"/>`).join('')}</g>`;
}

// Wrap text into lines that fit maxChars (cond is narrow; chars ≈ width/(size*0.42))
function wrap(text, maxChars) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxChars && cur) { lines.push(cur); cur = w; }
    else cur = (cur + ' ' + w).trim();
  }
  if (cur) lines.push(cur);
  return lines;
}

function headline(lines, { x, y, size, fill = '#FFFFFF', accentFrom = -1, opacity = 1 }) {
  return lines.map((l, i) =>
    `<text x="${x}" y="${y + i * size * 1.04}" font-family="${COND}" font-weight="900" font-size="${size}" fill="${accentFrom >= 0 && i >= accentFrom ? EMBER : fill}" opacity="${opacity}">${esc(l.toUpperCase())}</text>`
  ).join('\n');
}

const seriesTag = (x, y, label) =>
  `<text x="${x}" y="${y}" font-family="${MONO}" font-size="26" letter-spacing="6" fill="${EMBER}">${esc(label.toUpperCase())}</text>`;
const microTag = (x, y, label, anchor = 'start') =>
  `<text x="${x}" y="${y}" font-family="${MONO}" font-size="24" letter-spacing="4" fill="${MICRO}" text-anchor="${anchor}">${esc(label.toUpperCase())}</text>`;

async function renderSvg(svg, out) {
  await sharp(Buffer.from(svg)).png().toFile(out);
}

// ---- layout: truth (1080x1920 reel) ------------------------------------
// Motion is rhetorical, not animated: hard cuts and holds, no fades.
// black -> line1 -> hold -> line2 -> hold -> ember rule -> mark. The
// pause is part of the argument (founder-approved judgment-gate note).
async function truth(spec, outDir) {
  const W = 1080, H = 1920, X = 96;
  const l1 = wrap(spec.line1, 16), l2 = wrap(spec.line2, 16);
  const SIZE = 118;
  const block = l1.length * SIZE * 1.04 + 40 + l2.length * SIZE * 1.04;
  const y0 = (H - block) / 2 + SIZE * 0.8;
  const yRule = y0 + block + 10;
  const frame = (s1, s2, sRule, sEnd) => `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${W}" height="${H}" fill="${INK}"/>
    ${s1 ? headline(l1, { x: X, y: y0, size: SIZE }) : ''}
    ${s2 ? headline(l2, { x: X, y: y0 + l1.length * SIZE * 1.04 + 40, size: SIZE, fill: EMBER }) : ''}
    ${sRule ? `<rect x="${X}" y="${yRule}" width="150" height="6" fill="${EMBER}"/>` : ''}
    ${sEnd ? markSvg(W - 150, H - 190, 70) + microTag(X, H - 90, spec.url ?? 'getkeel.io') : ''}
  </svg>`;
  // 32 frames @ 8fps = 4s. Beats: black 0-3, line1 @4, line2 @13, rule @21, end @25.
  const framesDir = join(outDir, 'frames');
  mkdirSync(framesDir, { recursive: true });
  for (let f = 0; f < 32; f++) {
    await renderSvg(frame(f >= 4, f >= 13, f >= 21, f >= 25), join(framesDir, `f${String(f).padStart(2, '0')}.png`));
  }
  const mp4 = join(outDir, `${spec.id}.mp4`);
  try {
    execFileSync('ffmpeg', ['-y', '-framerate', '8', '-i', join(framesDir, 'f%02d.png'),
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', '30', mp4], { stdio: 'pipe' });
  } catch { console.warn('ffmpeg unavailable - frames only'); }
  await sharp(join(framesDir, 'f31.png')).resize(540).webp({ quality: 80 }).toFile(join(outDir, `${spec.id}-final-frame.webp`));
  console.log(`truth: ${spec.id} -> mp4 (rhetorical beats) + final frame`);
}

// ---- layout: quote (1080x1350) -----------------------------------------
async function quote(spec, outDir) {
  const W = 1080, H = 1350, X = 84;
  const imgH = 640;
  const lines = wrap(spec.quote, 24);
  const SIZE = 76;
  const art = await sharp(spec.image).resize(W, imgH, { fit: 'cover' }).toBuffer();
  const artB64 = `data:image/png;base64,${(await sharp(art).png().toBuffer()).toString('base64')}`;
  const yQ = imgH + 130;
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${W}" height="${H}" fill="${INK}"/>
    <image href="${artB64}" x="0" y="0" width="${W}" height="${imgH}"/>
    <rect x="0" y="${imgH}" width="${Math.round(W * 0.8)}" height="4" fill="${EMBER}"/>
    ${seriesTag(X, imgH + 70, spec.series ?? 'Nobody writes this down')}
    ${headline(lines, { x: X, y: yQ + SIZE, size: SIZE })}
    ${microTag(X, H - 100, spec.attribution ?? '')}
    ${markSvg(W - 140, H - 150, 64)}
  </svg>`;
  await renderSvg(svg, join(outDir, `${spec.id}.png`));
  await sharp(join(outDir, `${spec.id}.png`)).webp({ quality: 85 }).toFile(join(outDir, `${spec.id}.webp`));
  console.log(`quote: ${spec.id}`);
}

// ---- layout: carousel (1080x1350 per slide) ----------------------------
async function carousel(spec, outDir) {
  const W = 1080, H = 1350, X = 84;
  mkdirSync(outDir, { recursive: true });
  for (const [i, slide] of spec.slides.entries()) {
    const n = i + 1;
    let body = '';
    if (slide.type === 'hook' || slide.type === 'claim') {
      let lines, accentFrom = -1;
      if (slide.accentSentence != null) {
        // wrap sentences independently; accent starts where sentence N begins
        const sentences = String(slide.text).match(/[^.!?]+[.!?]/g) ?? [slide.text];
        lines = [];
        for (const [si, sen] of sentences.entries()) {
          if (si === slide.accentSentence) accentFrom = lines.length;
          lines.push(...wrap(sen.trim(), 15));
        }
      } else {
        lines = wrap(slide.text, 15);
      }
      const SIZE = slide.type === 'hook' ? 140 : 110;
      const y0 = (H - lines.length * SIZE * 1.04) / 2 + SIZE * 0.8;
      body = headline(lines, { x: X, y: y0, size: SIZE, accentFrom });
    } else if (slide.type === 'close') {
      const lines = wrap(slide.text, 18);
      const SIZE = 92;
      const y0 = (H - lines.length * SIZE * 1.04) / 2 + SIZE * 0.6;
      body = headline(lines, { x: X, y: y0, size: SIZE }) +
        markSvg(X, y0 + lines.length * SIZE * 1.04 + 60, 90) +
        `<text x="${X + 110}" y="${y0 + lines.length * SIZE * 1.04 + 125}" font-family="${MONO}" font-size="30" letter-spacing="4" fill="${MICRO}">${esc((spec.url ?? "getkeel.io").toUpperCase())}</text>`;
    }
    const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${W}" height="${H}" fill="${INK}"/>
      ${body}
      ${seriesTag(X, 120, spec.series ?? 'Field notes')}
      ${microTag(W - X, 120, `${n} / ${spec.slides.length}`, 'end')}
      ${i === 0 ? '' : `<rect x="${X}" y="${H - 120}" width="${Math.round((W - 2 * X) * (n / spec.slides.length))}" height="3" fill="${EMBER}"/>`}
    </svg>`;
    await renderSvg(svg, join(outDir, `slide-${n}.png`));
  }
  console.log(`carousel: ${spec.id} (${spec.slides.length} slides)`);
}

// ---- driver ------------------------------------------------------------
const spec = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const outIdx = process.argv.indexOf('--out');
const outDir = outIdx > -1 ? process.argv[outIdx + 1] : join('content', 'social', 'assets', spec.id);
mkdirSync(outDir, { recursive: true });
if (spec.layout === 'truth') await truth(spec, outDir);
else if (spec.layout === 'quote') await quote(spec, outDir);
else if (spec.layout === 'carousel') await carousel(spec, outDir);
else { console.error(`unknown layout ${spec.layout}`); process.exit(1); }
