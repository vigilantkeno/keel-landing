#!/usr/bin/env node
// Import illustration-system exemplars from an exported Claude Design bundle
// into content/art/reference/ as web-sized WebP.
//
// These are not decoration: they are the canonical visual definition of the
// system, and the style-reference inputs for providers that support image
// conditioning — a far stronger consistency lever than prompt text alone.
//
// Usage:
//   node scripts/art/import-reference.mjs <unzipped-design-export-dir>
//
// Re-run whenever the design system's exemplars change. Source of truth is
// the design project (see content/art/STYLE_SPEC.md).
import sharp from 'sharp';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

// source basename in the export -> committed reference name (family-prefixed)
const EXEMPLARS = {
  atrium: 'arch-atrium',
  skyscrapers: 'arch-skyscrapers',
  folders: 'obj-folders',
  'presentation-room': 'human-presentation-room',
  'data-streams': 'abs-data-streams',
  desk: 'aperture-desk',
};

const WIDTH = 1280; // reference/conditioning size — not a shipping asset
const QUALITY = 82; // deep blacks band below q80 (STYLE_SPEC "Export")

const root = process.argv[2];
if (!root) {
  console.error('usage: node scripts/art/import-reference.mjs <unzipped-design-export-dir>');
  process.exit(1);
}

const srcDir = join(root, 'templates', 'illustration-system', 'img');
if (!existsSync(srcDir)) {
  console.error(`no exemplar directory at ${srcDir} — is this a Keel Design System export?`);
  process.exit(1);
}

const outDir = join(process.cwd(), 'content', 'art', 'reference');
mkdirSync(outDir, { recursive: true });

let total = 0;
for (const [src, name] of Object.entries(EXEMPLARS)) {
  const from = join(srcDir, `${src}.png`);
  if (!existsSync(from)) {
    console.warn(`skip ${src}: not in export`);
    continue;
  }
  const info = await sharp(from)
    .resize({ width: WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(join(outDir, `${name}.webp`));
  total += info.size;
  console.log(`${name}.webp  ${info.width}x${info.height}  ${Math.round(info.size / 1024)}KB`);
}
console.log(`\ntotal ${Math.round(total / 1024)}KB in content/art/reference/`);
