// Loads the machine-readable style contract (content/art/style.json) and
// composes final generation prompts. The style suffix and negative list are
// byte-exact and version-locked in style.json — this module never edits or
// paraphrases them, it only concatenates.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export function loadStyle(root = process.cwd()) {
  return JSON.parse(readFileSync(join(root, 'content', 'art', 'style.json'), 'utf8'));
}

/**
 * slotsText: the six slots as one prose line (subject · space · viewpoint ·
 * light · ember aperture · negative space) — the only per-image free text.
 * The provider adapter decides how negativePrompt is applied (a native
 * negative-prompt param where the API has one; folded into the prompt as an
 * avoid-list where it doesn't).
 */
export function composePrompt(style, slotsText) {
  return {
    prompt: `${slotsText.trim().replace(/\s+/g, ' ')}, ${style.styleSuffix}`,
    negativePrompt: style.negativePrompt,
    version: style.version,
  };
}

/** The four worked examples from STYLE_SPEC.md — the bake-off corpus. */
export const WORKED_EXAMPLES = {
  arch: {
    title: 'How Keel decides what to escalate',
    slots:
      'A curved concrete mezzanine sweeping to the right, a single suited figure walking away from camera, low three-quarter viewpoint, late-afternoon raking light from the right, an ember-orange doorway at the end of the corridor spilling light across the floor, left half of the frame in deep shadow',
  },
  obj: {
    title: 'What Keel remembers about an account',
    slots:
      'A fanned stack of manila and bone file folders on black, macro three-quarter crop running out of frame, hard side light, one ember-orange tab standing proud of the stack, a faint white dot-matrix embossed on the front black folder, right third empty',
  },
  human: {
    title: 'Running a debrief that actually changes behavior',
    slots:
      "Three silhouetted figures in a glass-walled meeting room seen from the dark corridor outside, straight-on elevation, the room's bone-white wall the only lit plane, a small ember-orange square on the presentation board, the outer two-thirds of the frame in near-black",
  },
  abs: {
    title: 'Routing every inbound message',
    slots:
      'Twenty thin horizontal lines converging through a single small aperture and fanning into an ordered dot grid, flat elevation, no perspective, black field, bone and periwinkle lines with four ember-orange lines, wide empty margins',
  },
};
