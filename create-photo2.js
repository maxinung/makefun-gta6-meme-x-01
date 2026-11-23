// create-photo2.js — GTA 6 meme-x-01, rebuild #2 (photorealistic, real-photo base)
//
// Base: photo-base2.jpg — a REAL photo of a blank green highway sign on a
// gantry at night (white border, rounded corners, button dots, spotlight
// under the panel, dark cloudy sky, truss). The photo's own panel IS the
// canvas: the sign copy is drawn INSIDE the existing white border and the
// panel's light falloff is left alone — no green paint anywhere.
// DETOUR is a small orange placard pinned near the top of the panel (its own
// border + shadow, like a real EXIT tab), not a full-width strip. The ghost
// is not a sticker any more: it is a big tired road worker standing on the
// support beam, holding a SLOW paddle — the character is the joke. Rendered
// with node-canvas.
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

  // --- the ghost, as a tired road worker ---
  // The sign alone was not a meme, so the joke is now a character: the
  // make.fun ghost has been holding this detour for thirteen years and is
  // dozing off on the job. It stands on the support beam at the panel's
  // bottom-right, big enough to be the second thing the eye lands on after
  // GTA VI. It is drawn by hand in code, no sticker disc: white body with a
  // thick black outline, sleepy shut eyes, an orange hard hat slipping
  // sideways, a SLOW paddle in one hand and the magenta star coin in the
  // other. The sign copy is untouched, and the ghost stays clear of every
  // line (the nearest text ends at x 984; the ghost starts at x 1000).
  const GX = 1092;   // ghost centre x
  const FEET = 902;  // feet y, on the beam's top edge
  const TOP = 602;   // head top y (300 tall)
  // Scale the whole figure a touch around the feet, so it has breathing room
  // from the frame's right edge (the coin was 8px from it).
  ctx.save();
  ctx.translate(GX, FEET);
  ctx.scale(0.93, 0.93);
  ctx.translate(-GX, -FEET);

  // A pool of warm spill from the lamp, then a contact shadow on top of it,
  // so the feet stand on something visible: out here the beam is near-black,
  // and a shadow alone would vanish against it.
  ctx.save();
  ctx.translate(GX, FEET + 6);
  ctx.scale(1, 0.18);
  const pool = ctx.createRadialGradient(0, 0, 4, 0, 0, 120);
  pool.addColorStop(0, 'rgba(201,160,106,0.38)');
  pool.addColorStop(0.7, 'rgba(201,160,106,0.10)');
  pool.addColorStop(1, 'rgba(201,160,106,0)');
  ctx.fillStyle = pool;
  ctx.beginPath();
  ctx.arc(0, 0, 120, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.translate(GX, FEET + 4);
  ctx.scale(1, 0.14);
  const sh = ctx.createRadialGradient(0, 0, 2, 0, 0, 95);
  sh.addColorStop(0, 'rgba(0,0,0,0.55)');
  sh.addColorStop(0.7, 'rgba(0,0,0,0.22)');
  sh.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = sh;
  ctx.beginPath();
  ctx.arc(0, 0, 95, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Body: a slim ghost, dome top, sides flaring slightly to two rounded
  // feet with a notch between them, like the mascot.
  ctx.beginPath();
  ctx.moveTo(1012, 690);
  ctx.bezierCurveTo(1012, 640, 1040, TOP, GX, TOP);
  ctx.bezierCurveTo(1144, TOP, 1172, 640, 1172, 690);
  ctx.bezierCurveTo(1178, 770, 1185, 820, 1185, 862);
  ctx.bezierCurveTo(1185, 892, 1165, FEET, 1140, FEET);
  ctx.bezierCurveTo(1120, FEET, 1105, 884, GX, 884);
  ctx.bezierCurveTo(1079, 884, 1064, FEET, 1044, FEET);
  ctx.bezierCurveTo(1019, FEET, 1000, 892, 1000, 862);
  ctx.bezierCurveTo(1000, 820, 1006, 770, 1012, 690);
  ctx.closePath();
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.lineWidth = 10;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#111111';
  ctx.stroke();

  // Sleepy shut eyes: two shallow U curves, outer ends drooping.
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#111111';
  ctx.beginPath();
  ctx.moveTo(1055, 668);
  ctx.quadraticCurveTo(1068, 682, 1081, 670);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(1103, 670);
  ctx.quadraticCurveTo(1116, 682, 1129, 668);
  ctx.stroke();

  // Hard hat, orange, slipping sideways.
  ctx.save();
  ctx.translate(GX, 612);
  ctx.rotate(-8 * Math.PI / 180);
  ctx.beginPath();
  ctx.moveTo(-72, 18);
  ctx.bezierCurveTo(-72, -28, -40, -48, 0, -48);
  ctx.bezierCurveTo(40, -48, 72, -28, 72, 18);
  ctx.closePath();
  ctx.fillStyle = '#e8912d';
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#111111';
  ctx.stroke();
  roundRectPath(ctx, -82, 14, 164, 12, 6);
  ctx.fillStyle = '#e8912d';
  ctx.fill();
  ctx.stroke();
  roundRectPath(ctx, -9, -56, 18, 34, 8);
  ctx.fillStyle = '#e8912d';
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Zzz, floating above the hat.
  ctx.save();
  ctx.translate(GX, 545);
  ctx.rotate(-12 * Math.PI / 180);
  ctx.font = '700 30px "Liberation Sans", "DejaVu Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(168,200,224,0.9)';
  ctx.fillText('Zzz', 0, 0);
  ctx.restore();

  // The paddle: an orange octagon on a short stick, held against the belly.
  // SLOW on top, and the absurd detail — DAY 4,748 — small underneath.
  const px = 1085, py = 780, pr = 60;
  ctx.strokeStyle = '#5a4a3a';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(px, py + 55);
  ctx.lineTo(px, 878);
  ctx.stroke();
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (22.5 + i * 45) * Math.PI / 180;
    const vx = px + pr * Math.cos(a), vy = py + pr * Math.sin(a);
    if (i === 0) ctx.moveTo(vx, vy); else ctx.lineTo(vx, vy);
  }
  ctx.closePath();
  ctx.fillStyle = '#e8912d';
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#111111';
  ctx.stroke();
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (22.5 + i * 45) * Math.PI / 180;
    const vx = px + (pr - 8) * Math.cos(a), vy = py + (pr - 8) * Math.sin(a);
    if (i === 0) ctx.moveTo(vx, vy); else ctx.lineTo(vx, vy);
  }
  ctx.closePath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#f5f5f5';
  ctx.stroke();
  ctx.fillStyle = '#111111';
  ctx.textAlign = 'center';
  ctx.font = '700 30px "Liberation Sans", "DejaVu Sans", sans-serif';
  ctx.fillText('SLOW', px, py - 2);
  ctx.font = '700 15px "Liberation Sans", "DejaVu Sans", sans-serif';
  ctx.fillText('DAY 4,748', px, py + 24);
  // hand gripping the stick
  ctx.beginPath();
  ctx.arc(px, 878, 14, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#111111';
  ctx.stroke();

  // The magenta star coin in the other hand.
  ctx.beginPath();
  ctx.arc(1160, 860, 15, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#111111';
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(1168, 852, 22, 0, Math.PI * 2);
  ctx.fillStyle = '#c41c83';
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#111111';
  ctx.stroke();
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? 13 : 5.5;
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const vx = 1168 + r * Math.cos(a), vy = 852 + r * Math.sin(a);
    if (i === 0) ctx.moveTo(vx, vy); else ctx.lineTo(vx, vy);
  }
  ctx.closePath();
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.restore(); // end the ghost's scale transform

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
