// Minimal .env loader — no dependency, loads .env.local then .env from the
// repo root into process.env (existing vars win, .env.local wins over .env).
// Values never get logged; callers must treat OPENAI_API_KEY as radioactive.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export function loadEnv(root = process.cwd()) {
  for (const name of ['.env.local', '.env']) {
    const p = join(root, name);
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, 'utf8').split('\n')) {
      const m = /^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/.exec(line.trim());
      if (!m) continue;
      const [, k, raw] = m;
      if (process.env[k] !== undefined) continue;
      process.env[k] = raw.replace(/^["']|["']$/g, '');
    }
  }
}

export function requireEnv(k) {
  loadEnv();
  const v = process.env[k];
  if (!v) {
    console.error(`missing ${k} — put it in .env.local at the repo root`);
    process.exit(1);
  }
  return v;
}
