// create-photo.js — photorealistic DETOUR meme compositor.
//
// Base: a real night photo of a green highway sign (photo-base.jpg, AI photo).
// The photo's sign panel is a genuine photograph, so the meme reads as a photo,
// not a drawing. Sign copy is drawn in code so every letter stays sharp and
// spelled right; the ghost goes on as a die-cut sticker on the sign's corner.
//
// Pipeline: base photo -> clean the panel (fades the photo's own faint marks)
// -> orange DETOUR band -> sign copy -> ghost sticker -> meme.png + meme_480.png.
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

const W = 1200;
const H = 1200;

// Sign panel geometry in final pixels. The base photo is 768x768; we crop its
// bottom strip (where the generator's watermark sits) and its side slivers,
// then scale the remaining 706x706 square up to the canvas.
const SRC_X = 31;
const SRC_SIZE = 706;
const SCALE = W / SRC_SIZE;

// Panel interior, measured off the photo (green field inside the sign's frame).
const PANEL = { x: 224, y: 362, w: 763, h: 568 };
const PANEL_CX = PANEL.x + PANEL.w / 2; // 605

// Text block sits slightly left of the panel centre so the sticker owns the
// bottom-right corner without touching any letter.
const TEXT_CX = 560;

const SIGN_FONT = '"Nimbus Sans Narrow", "Liberation Sans", sans-serif';

async function build() {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  const base = await loadImage('photo-base.jpg');
  const ghost = await loadImage('mark-1024.png');

  // 1. Base photo, watermark cropped away, scaled to fill the canvas.
  ctx.drawImage(base, SRC_X, 0, SRC_SIZE, SRC_SIZE, 0, 0, W, H);

  // 2. Clean the panel: a near-opaque green wash in the photo's own greens
  // (sampled: lighter at the top, darker at the bottom). It fades the faint
  // marks the photo generator left on the panel to invisible smudges while
  // the panel's frame, posts, road and sky stay fully photographic.
  const wash = ctx.createLinearGradient(0, PANEL.y, 0, PANEL.y + PANEL.h);
  wash.addColorStop(0, 'rgba(15, 60, 53, 0.97)');
  wash.addColorStop(1, 'rgba(15, 47, 46, 0.97)');
  ctx.fillStyle = wash;
  ctx.fillRect(PANEL.x, PANEL.y, PANEL.w, PANEL.h);

  // 3. Orange DETOUR band across the panel top, with a soft shadow under it.
  // A faint vertical gradient (lit from above) keeps it reading as a physical
  // plaque rather than a flat digital rectangle.
  const stripY = PANEL.y;
  const stripH = 100;
  const stripGrad = ctx.createLinearGradient(0, stripY, 0, stripY + stripH);
  stripGrad.addColorStop(0, '#e08a35');
  stripGrad.addColorStop(1, '#cf7326');
  ctx.fillStyle = stripGrad;
  ctx.fillRect(PANEL.x, stripY, PANEL.w, stripH);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.fillRect(PANEL.x, stripY, PANEL.w, 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
  ctx.fillRect(PANEL.x, stripY + stripH, PANEL.w, 6);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#111111';
  ctx.font = `800 84px ${SIGN_FONT}`;
  ctx.fillText('DETOUR', PANEL_CX, stripY + stripH / 2);

  // 4. Sign copy, white, bold condensed — the joke, largest first.
  ctx.fillStyle = '#ffffff';

  // GTA VI, the destination.
  ctx.font = `800 168px ${SIGN_FONT}`;
  ctx.fillText('GTA VI', TEXT_CX, 620);

  // 13 YEARS AHEAD, with a drawn arrow (a shape, never a font glyph, so it
  // can never render as a missing-character box).
  ctx.font = `800 62px ${SIGN_FONT}`;
  const line = '13 YEARS AHEAD';
  const lineW = ctx.measureText(line).width;
  const lineX = TEXT_CX - lineW / 2;
  ctx.fillText(line, TEXT_CX, 730);
  const ax0 = TEXT_CX + lineW / 2 + 20;
  const ay = 730;
  ctx.fillRect(ax0, ay - 5, 46, 10);
  ctx.beginPath();
  ctx.moveTo(ax0 + 46, ay - 17);
  ctx.lineTo(ax0 + 46, ay + 17);
  ctx.lineTo(ax0 + 78, ay);
  ctx.closePath();
  ctx.fill();

  // Thin divider.
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.fillRect(320, 772, 480, 3);

  // TOLL PAID BY make.fun — regular weight for the words, bold for the name.
  const left = 'TOLL PAID BY ';
  const name = 'make.fun';
  ctx.font = `700 42px ${SIGN_FONT}`;
  const leftW = ctx.measureText(left).width;
  ctx.font = `800 42px ${SIGN_FONT}`;
  const nameW = ctx.measureText(name).width;
  const totalW = leftW + nameW;
  let cx = TEXT_CX - totalW / 2;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.font = `700 42px ${SIGN_FONT}`;
  ctx.fillText(left, cx, 848);
  cx += leftW;
  ctx.font = `800 42px ${SIGN_FONT}`;
  ctx.fillText(name, cx, 848);
  ctx.textAlign = 'center';

  // 5. Ghost sticker on the sign's bottom-right corner: a soft shadow, a
  // white die-cut ring, the ghost mark itself, tilted a few degrees like a
  // real sticker stuck on by hand.
  const gx = 885;
  const gy = 845;
  const gr = 105;
  // Soft shadow (radial, unrotated — shadows fall straight down).
  const shadow = ctx.createRadialGradient(gx + 6, gy + 9, gr * 0.2, gx + 6, gy + 9, gr * 1.15);
  shadow.addColorStop(0, 'rgba(0, 0, 0, 0.38)');
  shadow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.arc(gx + 6, gy + 9, gr * 1.15, 0, Math.PI * 2);
  ctx.fill();
  // Sticker body, tilted.
  ctx.save();
  ctx.translate(gx, gy);
  ctx.rotate(-5 * Math.PI / 180);
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, gr, 0, Math.PI * 2);
  ctx.fill();
  ctx.drawImage(ghost, -105, -105, 210, 210);
  ctx.restore();

  // 6. Outputs.
  fs.writeFileSync('meme.png', canvas.toBuffer('image/png'));

  const small = createCanvas(480, 480);
  const sctx = small.getContext('2d');
  sctx.drawImage(canvas, 0, 0, 480, 480);
  fs.writeFileSync('meme_480.png', small.toBuffer('image/png'));

  console.log('photo meme written: meme.png + meme_480.png');
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
