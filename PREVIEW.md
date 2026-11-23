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
- Composition (fixed): the photo now fills the whole 1200x1200 frame by
  scale + centre-crop — no flat sky extension, no seam. The crop window is
  the panel's own width plus a 10px margin each side (1036px), so the scale
  is 1.1583, the largest one that keeps the whole sign in frame. The photo
  sits 40px below centre, which puts the panel nearer the frame centre and
  shrinks the bottom mirror strip to ~39px. The sky strips above and below
  the photo are a vertical mirror of the photo's own edge rows, so the frame
  is photo content edge to edge and the boundary is value-continuous. The
  top mirror is capped at base row 95 so the two small mounts on the panel
  top are not mirrored into the sky. Text, placard and ghost were re-mapped
  to the new panel bounds (measured again from pixel scans of the cropped
  image) and scaled ~1.32x so their proportions to the panel stay the same.
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

## Verification — I looked at it myself (fix pass)

- Full 1200x1200: the sign fills the frame and reads as a real night photo
  — border, rounded corners, button dots, falloff, spotlight glow, support
  beam, clouds to the bottom edge.
- 480x480 (judge size): DETOUR, GTA VI, 13 YEARS AHEAD arrow, TOLL PAID BY
  make.fun all readable; ghost recognisable.
- Zoom text zone: zero garbled text, zero overlap, all letters sharp.
- Zoom ghost zone: ghost sharp (sparkle eyes, star coin), sticker tilted on
  the panel corner, arrow and divider stop clear of it; the disc is fully
  inside the frame (magenta bbox x 1029..1180).
- Zoom panel corners: white border + rounded corners + button-dot rows all
  visible on both corners — the strongest "real sign" signals.
- Zoom bottom zone: clouds run to the bottom edge — no seam line, no flat
  band. Pixel scan: the row-brightness jump at the mirror boundary (0.62)
  equals natural cloud variation elsewhere (0.57), so there is no seam to
  find. Top rows are pure black (0 non-black pixels).
- Zero watermark, zero AI-garbled text, zero overlap.

## Honest notes (fix pass)

- The seam and the flat bottom band are gone: the whole frame is photo
  content and the row-brightness scan finds no seam.
- The bottom ~39px is a vertical mirror of the photo's own bottom clouds,
  not a flat band — no hard edge, and its brightness jump matches natural
  cloud variation. A viewer hunting for symmetry in a zoomed bottom crop
  could notice the clouds repeat, but at display size it reads as clouds.
- The side truss is essentially cropped out (only a ~12px sliver remains on
  each side): the panel is 1016px wide in the base, and at the height-filling
  scale the visible window is only 900px wide, so no uniform scale + crop
  can keep both the whole panel and the truss in a square frame. The sign
  keeps its support beam and spotlight, so it does not float — but the
  gantry truss is not fully visible.
- The sticker's chipped-edge wear is subtle — at display size the tilt,
  shadow and corner placement do most of the "old sticker" work, not the
  notches.

## Post text (unchanged)

POST-DRAFT.md, ~280 characters, play code makefun-pomelo-pastry-cascade.
