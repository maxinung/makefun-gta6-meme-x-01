# PREVIEW.md — GTA 6 meme, flagger ghost (Kimchi, direct)

## Why a third version

Max rejected the real-photo sign (commit f093e55): "katrok, gak ada meme
memenya sama sekali." The sign was a real photo, but it had no character, no
emotion, no absurdity — the joke lived only in the text. A Google image
search for funny GTA 6 memes showed the same pattern in every one of them:
there is always a character or a scene with an emotion or an absurd twist —
a Pepe coping at a messy desk, a skeleton waiting a thousand years, a bored
stick figure at a computer, a mugshot alligator. Not one funny meme was just
an empty sign or document. So the joke is now a character.

## What changed

- The small sticker in the panel's bottom-right corner is gone.
- The ghost is now a big tired road worker, about 280px tall, standing on
  the support beam at the panel's bottom-right. It is the second thing the
  eye lands on after GTA VI.
- It wears a small orange hard hat that is slipping sideways, its eyes are
  shut in sleepy U curves, a "Zzz" floats above the hat, it holds an orange
  SLOW paddle in one hand and the magenta star coin in the other. The paddle
  carries one small absurd detail: "DAY 4,748" — how long it has been
  holding this detour.
- The ghost is drawn by hand in code (bezier body, no sticker disc), so it
  is a character standing in the scene rather than a badge pasted on it.
- The photo and the sign copy are untouched: same real-photo base, same
  DETOUR placard, GTA VI, 13 YEARS AHEAD with its drawn arrow, and TOLL
  PAID BY make.fun, in the same places.
- The renderer is still `create-photo2.js`, edited in place (the sticker
  block replaced by the flagger block). `mark-1024.png` is no longer loaded.

## Grounding

The beam is near-black out at the right end, away from the lamp, so a
shadow alone would vanish against it. The feet stand on a soft pool of warm
spill from the lamp (very low opacity) with a contact shadow on top of it,
so the ghost has a surface to stand on and does not float.

## Verification — I looked at it myself

- Full 1200x1200: the sign is still the real photo (border, button dots,
  falloff, spotlight, beam, clouds); the ghost is a big readable character
  at the bottom-right, hard hat and paddle clear.
- 480x480 (judge size): DETOUR, GTA VI, 13 YEARS AHEAD arrow, TOLL PAID BY
  make.fun all readable; the ghost is recognisable with its hat and paddle.
- Zoom ghost zone: sleepy eyes, tilted hat, Zzz, SLOW + DAY 4,748 on the
  paddle, magenta star coin — all sharp, no overlap with the arrow, divider
  or bottom line (nearest text ends at x 984; the ghost starts at x 1000).
- Zoom text zone: zero garbled text, zero overlap, all letters sharp.
- Zoom feet zone: the feet sit on the beam's top edge, warm pool and shadow
  visible under them.
- Zero watermark, zero AI-garbled text, zero overlap.
- One fix during verification: the first render had the coin 8px from the
  frame's right edge, so the whole ghost was scaled 0.93 around the feet for
  breathing room. Re-rendered and re-checked at full size, 480 and zooms.

## Honest notes

- The ghost is slimmer than the mascot (about 0.62 wide-to-tall): the free
  strip between the text and the frame edge is only ~210px wide, and the
  mascot's own proportions would not fit it without touching the arrow or
  the frame. It still reads as the same character — same face shape, same
  outline, same coin.
- The hand gripping the paddle stick is a white circle sitting in the notch
  between the feet; at high zoom it reads a little like a ball, though the
  stick connects it to the paddle and at display size it reads as a hand.
- The beam is near-black at the right end, so the grounding leans on the
  warm light pool; it is deliberately subtle so it does not look like a
  stage light.

## Post text (unchanged)

POST-DRAFT.md, ~280 characters, play code makefun-pomelo-pastry-cascade.
