#!/usr/bin/env node
// Candidate generation CLI — STYLE_SPEC.md workflow steps 2–3 (assemble,
// generate-N). Selection stays human; this tool only produces candidates
// and an audit log. Nothing here touches the site.
//
//   node scripts/art/generate.mjs --example arch            # one worked example
//   node scripts/art/generate.mjs --example all -n 3        # bake-off corpus
//   node scripts/art/generate.mjs --slots "..." --name foo  # ad-hoc brief
//
// Options: -n <1..4> candidates per image (default 1), --quality low|medium|high,
// --size, --model, --max-images <cap> (invocation spend guard, default 8).
//
// Output: content/art/candidates/<name>/<name>-<i>-<id4>.png + run-log JSON
// (prompt, params, usage) alongside. Candidates are gitignored — only a
// human-selected, normalized image ever gets committed.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { loadStyle, composePrompt, WORKED_EXAMPLES } from './lib/style.mjs';
import * as openai from './providers/openai.mjs';

const provider = openai; // adapter seam: future providers are sibling modules

function arg(flag, dflt) {
  const i = process.argv.indexOf(flag);
  return i > -1 ? process.argv[i + 1] : dflt;
}

const example = arg('--example');
const slots = arg('--slots');
const name = arg('--name');
const n = Math.min(parseInt(arg('-n', '1'), 10) || 1, 4);
const quality = arg('--quality', 'medium');
const size = arg('--size', '1536x1024');
const model = arg('--model', process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1');
const maxImages = parseInt(arg('--max-images', '8'), 10);

const jobs = [];
if (example === 'all') {
  for (const [fam, ex] of Object.entries(WORKED_EXAMPLES)) {
    jobs.push({ name: `example-${fam}`, family: fam, slots: ex.slots, title: ex.title });
  }
} else if (example) {
  const ex = WORKED_EXAMPLES[example];
  if (!ex) {
    console.error(`unknown example "${example}" — one of: ${Object.keys(WORKED_EXAMPLES).join(', ')}, all`);
    process.exit(1);
  }
  jobs.push({ name: `example-${example}`, family: example, slots: ex.slots, title: ex.title });
} else if (slots && name) {
  jobs.push({ name, family: arg('--family', 'arch'), slots, title: name });
} else {
  console.error('usage: --example <arch|obj|human|abs|all> | --slots "<six slots>" --name <name>');
  process.exit(1);
}

const totalImages = jobs.length * n;
if (totalImages > maxImages) {
  console.error(
    `spend guard: this invocation would generate ${totalImages} images (cap ${maxImages}). ` +
    `Raise deliberately with --max-images ${totalImages}.`
  );
  process.exit(1);
}

const style = loadStyle();
const outRoot = join(process.cwd(), 'content', 'art', 'candidates');

for (const job of jobs) {
  const { prompt, negativePrompt, version } = composePrompt(style, job.slots);
  const dir = join(outRoot, job.name);
  mkdirSync(dir, { recursive: true });

  process.stdout.write(`${job.name} (${job.family}, n=${n}, ${quality}, ${model}) … `);
  const t0 = Date.now();
  const res = await provider.generate({ prompt, negativePrompt, n, size, quality, model });
  const secs = ((Date.now() - t0) / 1000).toFixed(1);

  const files = [];
  for (const [i, img] of res.images.entries()) {
    const id = createHash('sha256').update(img.buffer).digest('hex').slice(0, 4);
    const file = `${job.name}-${i + 1}-${id}.png`;
    writeFileSync(join(dir, file), img.buffer);
    files.push(file);
  }

  const log = {
    generatedAt: new Date().toISOString(),
    styleVersion: version,
    provider: provider.providerName,
    model: res.model,
    quality,
    size,
    family: job.family,
    title: job.title,
    slots: job.slots,
    prompt,
    negativePromptApplied: negativePrompt,
    usage: res.usage,
    files,
    seconds: Number(secs),
  };
  writeFileSync(join(dir, `run-${Date.now()}.json`), JSON.stringify(log, null, 2) + '\n');
  console.log(`${files.length} candidate(s) in ${secs}s -> content/art/candidates/${job.name}/`);
  if (res.usage) console.log(`  usage: ${JSON.stringify(res.usage)}`);
}
