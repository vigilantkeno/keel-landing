// OpenAI Images adapter. Raw fetch, no SDK — same posture as the product
// repo's LLM adapter: no hidden retries, no surprise behavior, the full
// request visible in one file. This is the ONLY module that touches the
// provider; swapping providers means adding a sibling file with the same
// generate() signature, nothing else changes.
//
// The Images API has no negative-prompt parameter, so the contract's
// negative list is folded into the prompt as an explicit avoid-list.
import { requireEnv } from '../lib/env.mjs';

const ENDPOINT = 'https://api.openai.com/v1/images/generations';

/**
 * generate({ prompt, negativePrompt, n, size, quality, model })
 *   -> { images: [{ buffer }], model, usage, created }
 * Throws on any non-2xx — callers decide about retries (default: none).
 */
export async function generate({
  prompt,
  negativePrompt,
  n = 1,
  size = '1536x1024',
  quality = 'medium',
  model = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1',
}) {
  const key = requireEnv('OPENAI_API_KEY');
  const fullPrompt = negativePrompt
    ? `${prompt}. Strictly avoid: ${negativePrompt}.`
    : prompt;

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model, prompt: fullPrompt, n, size, quality }),
  });

  if (!res.ok) {
    const body = await res.text();
    // Provider errors must never echo the key; they never contain it, but
    // truncate anyway to keep logs tidy.
    throw new Error(`openai ${res.status}: ${body.slice(0, 600)}`);
  }

  const json = await res.json();
  return {
    images: (json.data ?? []).map((d) => ({ buffer: Buffer.from(d.b64_json, 'base64') })),
    model,
    usage: json.usage ?? null,
    created: json.created ?? null,
  };
}

export const providerName = 'openai';
