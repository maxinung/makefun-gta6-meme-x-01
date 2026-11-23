# PREVIEW.md — GTA 6 meme, DETOUR rebuilt #2 from a real photo (Kimchi, direct)

## Why a second rebuild

Max rejected the first photorealistic version (commit 3ca322a): "Masih jelek,
cari referensi di google dulu untuk plank realistisnya." The leader searched
Google image results and summarised 7 real photos into REALISM-SPEC.md
(`~/workspace/makefun/refs/`). The diagnosis: v1 painted a flat green box
over a photo — no white border, no bolts, no light falloff, no texture, and
the DETOUR band was a full-width flat strip no real sign has. This rebuild
follows that spec.

## How it is built

- Base photo: `photo-base2.jpg` — a REAL photo of a blank green highway sign
  on a gantry at night (ref-blank-gantry-light, 1920x1080, downscaled to
  1600x900 for the repo). White border, rounded corners, rows of reflective
  button dots, a spotlight glowing under the panel, truss gantry, dark
  cloudy sky. The photo's own panel IS the canvas: the sign copy is drawn
  INSIDE the existing white border and the panel's falloff is left alone —
  no green paint anywhere.
- Composition: the photo is placed 1400 wide and centred in the 1200x1200
  frame, so the whole sign (all four borders), the truss at the sides and
  the spotlight below stay in frame — the sign STANDS in the scene instead
  of filling the frame edge to edge. The bands above/below are sky
  extensions: black on top (the photo's own top rows are pure black) and the
  photo's own bottom-row colour below, with a feathered seam and faint grain.
- DETOUR: a SMALL orange placard pinned near the top of the panel, with its
  own white border and a soft drop shadow — like a real EXIT tab, not a
  full-width strip.
- Sign copy: drawn in code (Liberation Sans Bold, never by an image model),
  so every letter is sharp and spelled right — GTA VI, 13 YEARS AHEAD with
  a drawn arrow, TOLL PAID BY make.fun.
- Ghost: the make.fun mark as a small sticker on the panel's bottom-right
  corner — tilted -6 degrees, soft shadow, a few chipped notches on the disc
  rim and two faint scratches, so it reads as a sticker that has been there
  a while, not a fresh badge.
- Renderer: `create-photo2.js`, written from scratch this session.
  `create-photo.js` (v1 renderer) and `photo-base.jpg` (v1 AI base) are
  removed; they no longer produce the meme.

## Verification — I looked at it myself

- Full 1200x1200: the sign reads as a real night photo — border, rounded
  corners, button dots, falloff, spotlight glow, truss, clouds.
- 480x480 (judge size): DETOUR, GTA VI, 13 YEARS AHEAD arrow, TOLL PAID BY
  make.fun all readable; ghost recognisable.
- Zoom text zone: zero garbled text, zero overlap, all letters sharp.
- Zoom ghost zone: ghost sharp (sparkle eyes, star coin), sticker tilted on
  the panel corner, arrow and divider stop clear of it.
- Zoom panel corner: white border + rounded corner + button-dot rows all
  visible — the strongest "real sign" signals.
- Zero watermark, zero AI-garbled text, zero overlap.

## Honest notes

- The bottom ~200px is a flat dark-blue sky extension; the seam where the
  photo's clouds end is faintly visible at full size. It reads as empty
  night sky, which is plausible, but it is the one place the frame is not
  pure photo.
- The sticker's chipped-edge wear is subtle — at display size the tilt,
  shadow and corner placement do most of the "old sticker" work, not the
  notches.

## Post text (unchanged)

POST-DRAFT.md, ~280 characters, play code makefun-pomelo-pastry-cascade.
