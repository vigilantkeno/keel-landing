import { execFileSync } from 'node:child_process';

/**
 * Last commit date for a tracked file, or null.
 *
 * Static routes need a real "when did this change" and there is only one
 * honest source for it. Filesystem mtime is useless on Vercel: the build
 * checks out fresh, so every file looks like it was touched at build time —
 * which is exactly the bug this module exists to remove. Git is the only
 * thing that knows when the content actually changed.
 *
 * Returns null rather than a fallback date when git can't answer (no git,
 * a shallow clone that doesn't reach this file's history, an untracked
 * file). Callers omit lastModified in that case. A sitemap entry with no
 * lastmod is honest; one with a wrong lastmod is the thing we're fixing.
 */
const cache = new Map();

export function lastCommitDate(relPath) {
  if (cache.has(relPath)) return cache.get(relPath);

  let result = null;
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', relPath], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (out) {
      const parsed = new Date(out);
      if (!Number.isNaN(parsed.getTime())) result = parsed;
    }
  } catch {
    /* fall through to null */
  }

  cache.set(relPath, result);
  return result;
}
