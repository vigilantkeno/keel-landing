#!/usr/bin/env node
// Batch candidate generation from a briefs file — same pipeline as
// generate.mjs, driven by JSON instead of flags. Sequential on purpose:
// simpler failure isolation, and the provider is the bottleneck anyway.
//
//   node scripts/art/batch-generate.mjs content/art/briefs/<file>.json
//
// Skips any brief whose candidates dir already has PNGs, so a crashed run
// resumes for free.
import { mkdirSync, writeFileSync, readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { loadStyle, composePrompt } from './lib/style.mjs';
import * as openai from './providers/openai.mjs';

const briefsPath = process.argv[2];
if (!briefsPath) { console.error('usage: node scripts/art/batch-generate.mjs <briefs.json>'); process.exit(1); }
const briefs = JSON.parse(readFileSync(briefsPath, 'utf8'));
const style = loadStyle();
const N = style.generation?.candidatesPerImage ?? 2;
const outRoot = join(process.cwd(), 'content', 'art', 'candidates');

let done = 0, skipped = 0, failed = 0;
for (const b of briefs) {
  const dir = join(outRoot, b.slug);
  if (existsSync(dir) && readdirSync(dir).some((f) => f.endsWith('.png'))) {
    console.log(`skip ${b.slug} (candidates exist)`);
    skipped++;
    continue;
  }
  mkdirSync(dir, { recursive: true });
  const { prompt, negativePrompt, version } = composePrompt(style, b.slots);
  process.stdout.write(`${b.slug} (${b.family}) … `);
  try {
    const t0 = Date.now();
    const res = await openai.generate({ prompt, negativePrompt, n: N, quality: 'medium' });
    const files = [];
    for (const [i, img] of res.images.entries()) {
      const id = createHash('sha256').update(img.buffer).digest('hex').slice(0, 4);
      const f = `${b.slug}-${i + 1}-${id}.png`;
      writeFileSync(join(dir, f), img.buffer);
      files.push(f);
    }
    writeFileSync(join(dir, `run-${Date.now()}.json`), JSON.stringify({
      generatedAt: new Date().toISOString(), styleVersion: version,
      provider: openai.providerName, model: res.model, quality: 'medium',
      family: b.family, slug: b.slug, slots: b.slots, prompt,
      negativePromptApplied: negativePrompt, usage: res.usage, files,
    }, null, 2) + '\n');
    console.log(`${files.length} in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
    done++;
  } catch (e) {
    console.log(`FAILED: ${String(e.message).slice(0, 200)}`);
    failed++;
  }
}
console.log(`\nbatch complete: ${done} generated, ${skipped} skipped, ${failed} failed`);
process.exit(failed ? 1 : 0);
