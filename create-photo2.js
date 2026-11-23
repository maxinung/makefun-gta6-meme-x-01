// create-photo2.js — GTA 6 meme-x-01, rebuild #2 (photorealistic, real-photo base)
//
// Base: photo-base2.jpg — a REAL photo of a blank green highway sign on a
// gantry at night (white border, rounded corners, button dots, spotlight
// under the panel, dark cloudy sky, truss). The photo's own panel IS the
// canvas: the sign copy is drawn INSIDE the existing white border and the
// panel's light falloff is left alone — no green paint anywhere.
// DETOUR is a small orange placard pinned near the top of the panel (its own
// border + shadow, like a real EXIT tab), not a full-width strip. The ghost
// is a small worn sticker on the panel's bottom-right corner, tilted, with a
// soft shadow and a few chipped edge notches. Rendered with node-canvas.
//
// Composition fix: the photo fills the whole frame by scale + centre-crop,
// with no flat sky extension and no seam. The crop window is the panel's
// own width plus a 10px margin each side, so the scale is the largest one
// that keeps the whole sign in frame; the small sky strips above and below
// the photo mirror the photo's own edge rows, so the frame is photo content
// edge to edge.
const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const REPO = __dirname;
const BASE = path.join(REPO, 'photo-base2.jpg');
const MARK = path.join(REPO, 'mark-1024.png');
const OUT = path.join(REPO, 'meme.png');
const OUT480 = path.join(REPO, 'meme_480.png');

const W = 1200, H = 1200;

// Panel geometry, re-measured from the base photo by pixel scans (1600x900
// base). Outer panel: x 229..1245, y 117..657. Inside the white border:
// x 244..1230, y 132..642. Panel centre (737, 387). A spotlight fixture sits
// just under the panel, centre-bottom, on a support beam.
const PANEL = { x0: 229, y0: 117, x1: 1245, y1: 657 };
const INNER = { x0: 244, y0: 132, x1: 1230, y1: 642 };
const CENTRE = { x: 737, y: 387 };

// The photo fills the whole frame by scale + centre-crop, with no flat sky
// extension anywhere. The panel is 1016px wide in the base, and at the
// height-filling scale (4/3) the visible window is only 900px wide, so that
// scale would slice 161px off the sign's left border and corner. The scale
// used here is the largest one that keeps the whole sign in frame: the crop
// window is the panel's own width plus a 10px margin each side (1036px), so
// the white border, both rounded corners, the button dots, the spotlight and
// the support beam all stay fully visible. The crop window is centred on
// the sign; the small sky strips above and below the photo are a vertical
// mirror of the photo's own edge rows, so the frame is photo content edge
// to edge and the boundary is value-continuous (no seam, no flat band).
const CROP = { x0: 219, y0: 0, x1: 1255, y1: 900 };
const S = W / (CROP.x1 - CROP.x0);
const PHOTO_H = (CROP.y1 - CROP.y0) * S;
// The photo sits 40px below centre: the panel lands nearer the frame centre
// and the bottom mirror band shrinks to ~39px, so the mirrored clouds are a
// thin strip instead of a wide reflected band. The top strip is pure black
// night sky, so the taller top mirror is invisible.
const PHOTO_Y = (H - PHOTO_H) / 2 + 40;
const MIRROR_TOP = PHOTO_Y;
const MIRROR_BOT = H - (PHOTO_Y + PHOTO_H);
const MIRROR_BOT_BASE = MIRROR_BOT / S;

function fx(x) { return (x - CROP.x0) * S; }
function fy(y) { return PHOTO_Y + y * S; }

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

async function main() {
  const base = await loadImage(BASE);
  const mark = await loadImage(MARK);
  const cv = createCanvas(W, H);
  const ctx = cv.getContext('2d');

  // --- the photo, filling the frame ---
  // Drawn scaled + centre-cropped. The sky strips above and below it are a
  // vertical mirror of the photo's own edge rows, so the whole frame is
  // photo content and the boundary is value-continuous: no hard seam, no
  // flat band. The top strip mirrors pure black night sky; the bottom strip
  // mirrors the photo's own clouds.
  ctx.drawImage(base, CROP.x0, CROP.y0, CROP.x1 - CROP.x0, CROP.y1 - CROP.y0,
    0, PHOTO_Y, W, PHOTO_H);
  // top mirror: base rows 0..95 flipped, base y=0 against the photo top.
  // Capped at 95 so the two small mounts on the panel top (base y 100+) are
  // not mirrored into the sky; rows 0..95 are pure black night sky.
  ctx.save();
  ctx.translate(0, PHOTO_Y);
  ctx.scale(1, -1);
  ctx.drawImage(base, CROP.x0, 0, CROP.x1 - CROP.x0, 95, 0, 0, W, MIRROR_TOP);
  ctx.restore();
  // bottom mirror: base rows (900-MIRROR_BOT_BASE)..900 flipped, base y=900 against the photo bottom
  ctx.save();
  ctx.translate(0, H);
  ctx.scale(1, -1);
  ctx.drawImage(base, CROP.x0, base.height - MIRROR_BOT_BASE, CROP.x1 - CROP.x0, MIRROR_BOT_BASE, 0, 0, W, MIRROR_BOT);
  ctx.restore();

  // --- sign copy, inside the photo's own white border ---
  const cx = fx(CENTRE.x);
  const ix0 = fx(INNER.x0), ix1 = fx(INNER.x1);
  const iy0 = fy(INNER.y0), iy1 = fy(INNER.y1);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  // DETOUR placard: a small orange board pinned near the top of the panel,
  // white border of its own, soft drop shadow — like a real EXIT tab.
  const plW = 397, plH = 87;
  const plX = cx - plW / 2, plY = iy0 + 21;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.45)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 5;
  roundRectPath(ctx, plX, plY, plW, plH, 11);
  ctx.fillStyle = '#e8912d';
  ctx.fill();
  ctx.restore();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#f5f5f5';
  roundRectPath(ctx, plX + 2, plY + 2, plW - 4, plH - 4, 8);
  ctx.stroke();
  ctx.fillStyle = '#111111';
  ctx.font = '700 58px "Liberation Sans", "DejaVu Sans", sans-serif';
  ctx.fillText('DETOUR', cx, plY + 62);

  // Main legend. White, like a real sign's retroreflective legend, with a
  // hairline shadow so it holds against the bright lamp glow low on the panel.
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0,0,0,0.28)';
  ctx.shadowBlur = 2;
  ctx.shadowOffsetY = 2;
  ctx.font = '700 196px "Liberation Sans", "DejaVu Sans", sans-serif';
  try { ctx.letterSpacing = '13px'; } catch (e) { /* older canvas: ignore */ }
  ctx.fillText('GTA VI', cx, 587);
  try { ctx.letterSpacing = '0px'; } catch (e) { /* older canvas: ignore */ }

  // Second line + a drawn arrow (a shape, never a font glyph).
  ctx.font = '700 82px "Liberation Sans", "DejaVu Sans", sans-serif';
  const line2 = '13 YEARS AHEAD';
  const tw = ctx.measureText(line2).width;
  const tx = cx - 53; // shifted left so the arrow fits on the right
  ctx.fillText(line2, tx, 706);
  const ax0 = tx + tw / 2 + 24, ax1 = ax0 + 90, ay = 682;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(ax0, ay - 12);
  ctx.lineTo(ax1 - 34, ay - 12);
  ctx.lineTo(ax1 - 34, ay - 29);
  ctx.lineTo(ax1, ay);
  ctx.lineTo(ax1 - 34, ay + 29);
  ctx.lineTo(ax1 - 34, ay + 12);
  ctx.lineTo(ax0, ay + 12);
  ctx.closePath();
  ctx.fill();
  ctx.shadowColor = 'rgba(0,0,0,0)';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Thin divider, stopping well short of the sticker.
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(150, 738);
  ctx.lineTo(984, 738);
  ctx.stroke();

  // Bottom line.
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 66px "Liberation Sans", "DejaVu Sans", sans-serif';
  ctx.fillText('TOLL PAID BY make.fun', cx, 815);

  // --- ghost sticker: small, on the panel's bottom-right corner, tilted,
  // soft shadow, edges chipped so it reads as a sticker that has been there
  // a while — not a fresh badge. ---
  const gs = 185, gx = 1105, gy = 792, pad = 32;
  const st = createCanvas(gs + pad * 2, gs + pad * 2);
  const sctx = st.getContext('2d');
  sctx.save();
  sctx.shadowColor = 'rgba(0,0,0,0.5)';
  sctx.shadowBlur = 10;
  sctx.shadowOffsetX = 4;
  sctx.shadowOffsetY = 6;
  sctx.drawImage(mark, pad, pad, gs, gs);
  sctx.restore();
  // chip a few tiny notches out of the disc rim
  const ccx = pad + gs / 2, ccy = pad + gs / 2, rad = gs / 2;
  sctx.globalCompositeOperation = 'destination-out';
  const notches = [[0.15, 3], [0.7, 2], [1.4, 4], [2.2, 2], [2.9, 3], [3.8, 2], [4.6, 4], [5.5, 2]];
  for (const pair of notches) {
    sctx.globalAlpha = 0.55;
    sctx.beginPath();
    sctx.arc(ccx + Math.cos(pair[0]) * rad, ccy + Math.sin(pair[0]) * rad, pair[1], 0, Math.PI * 2);
    sctx.fill();
  }
  // two faint scratches across the face
  sctx.globalCompositeOperation = 'source-over';
  sctx.globalAlpha = 0.10;
  sctx.strokeStyle = '#ffffff';
  sctx.lineWidth = 1.5;
  sctx.beginPath(); sctx.moveTo(pad + 18, pad + 42); sctx.lineTo(pad + 62, pad + 30); sctx.stroke();
  sctx.beginPath(); sctx.moveTo(pad + 96, pad + 108); sctx.lineTo(pad + 122, pad + 92); sctx.stroke();
  sctx.globalAlpha = 1;
  ctx.save();
  ctx.translate(gx, gy);
  ctx.rotate(-6 * Math.PI / 180);
  ctx.drawImage(st, -(gs + pad * 2) / 2, -(gs + pad * 2) / 2);
  ctx.restore();

  // --- outputs ---
  fs.writeFileSync(OUT, cv.toBuffer('image/png'));
  const small = createCanvas(480, 480);
  small.getContext('2d').drawImage(cv, 0, 0, 480, 480);
  fs.writeFileSync(OUT480, small.toBuffer('image/png'));
  console.log('WROTE', OUT, fs.statSync(OUT).size, 'bytes');
  console.log('WROTE', OUT480, fs.statSync(OUT480).size, 'bytes');
  console.log('crop base x', CROP.x0, '..', CROP.x1, 'scale', S.toFixed(4),
    'photo y', PHOTO_Y.toFixed(1), '..', (PHOTO_Y + PHOTO_H).toFixed(1));
  console.log('panel final x', fx(PANEL.x0).toFixed(0), '..', fx(PANEL.x1).toFixed(0),
    'y', fy(PANEL.y0).toFixed(0), '..', fy(PANEL.y1).toFixed(0));
  console.log('interior final x', ix0.toFixed(0), '..', ix1.toFixed(0),
    'y', iy0.toFixed(0), '..', iy1.toFixed(0));
}

main().catch((e) => { console.error('RENDER FAILED', e); process.exit(1); });
