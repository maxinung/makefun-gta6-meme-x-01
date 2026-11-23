// create-photo2.js — GTA 6 meme-x-01, rebuild #2 (photorealistic, real-photo base)
//
// Base: ref-blank-gantry-light.jpg — a REAL photo of a blank green highway
// sign on a gantry at night (white border, rounded corners, button dots,
// spotlight under the panel, dark cloudy sky, truss). The photo's own panel
// IS the canvas: the sign copy is drawn INSIDE the existing white border and
// the panel's light falloff is left alone — no green paint anywhere.
// DETOUR is a small orange placard pinned near the top of the panel (its own
// border + shadow, like a real EXIT tab), not a full-width strip. The ghost
// is a small worn sticker on the panel's bottom-right corner, tilted, with a
// soft shadow and a few chipped edge notches. Rendered with node-canvas.
const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const REPO = __dirname;
const BASE = path.join(REPO, 'photo-base2.jpg');
const MARK = path.join(REPO, 'mark-1024.png');
const OUT = path.join(REPO, 'meme.png');
const OUT480 = path.join(REPO, 'meme_480.png');

const W = 1200, H = 1200;

// Panel geometry measured from the base photo by pixel scans (1600x900 base).
// Outer panel: x 229..1245, y 117..657. Inside the white border:
// x 244..1230, y 132..642. Panel centre (737, 387). A spotlight fixture sits
// just under the panel, centre-bottom.
const PANEL = { x0: 229, y0: 117, x1: 1245, y1: 657 };
const INNER = { x0: 244, y0: 132, x1: 1230, y1: 642 };
const CENTRE = { x: 737, y: 387 };

// The photo is placed 1400 wide (scale 0.875 of the 1600 base) and centred,
// so the whole sign — all four borders, the truss at the sides, the
// spotlight below — stays in frame and the sign STANDS in the scene instead
// of filling the frame edge to edge. The 206px bands above/below are sky
// extensions: black on top (the photo's own top rows are pure black) and the
// photo's own bottom-row colour below, with a feathered seam.
const SCALE = 1400 / 1600;
const OX = (W - 1600 * SCALE) / 2;
const OY = (H - 900 * SCALE) / 2;
const PW = 1600 * SCALE, PH = 900 * SCALE;

function sx(x) { return OX + x * SCALE; }
function sy(y) { return OY + y * SCALE; }

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

  // Bottom-band colour: average of the photo's own bottom rows, so the sky
  // extension below the photo matches the real sky in the shot.
  const tmp = createCanvas(base.width, base.height);
  const tctx = tmp.getContext('2d');
  tctx.drawImage(base, 0, 0);
  const strip = tctx.getImageData(0, base.height - 24, base.width, 24).data;
  let r = 0, g = 0, b = 0, n = 0;
  for (let i = 0; i < strip.length; i += 4) { r += strip[i]; g += strip[i + 1]; b += strip[i + 2]; n++; }
  const fr = Math.round(r / n), fg = Math.round(g / n), fb = Math.round(b / n);
  const fill = 'rgb(' + fr + ',' + fg + ',' + fb + ')';

  // --- sky extensions ---
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, OY + 2);
  ctx.fillStyle = fill;
  ctx.fillRect(0, OY + PH - 2, W, H - (OY + PH) + 2);
  // faint grain over the bottom band so it carries the photo's texture
  const grain = createCanvas(160, 160);
  const gctx = grain.getContext('2d');
  const gd = gctx.createImageData(160, 160);
  for (let i = 0; i < gd.data.length; i += 4) {
    const v = 118 + Math.floor(Math.random() * 20);
    gd.data[i] = v; gd.data[i + 1] = v; gd.data[i + 2] = v; gd.data[i + 3] = 255;
  }
  gctx.putImageData(gd, 0, 0);
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = ctx.createPattern(grain, 'repeat');
  ctx.fillRect(0, OY + PH - 2, W, H - (OY + PH) + 2);
  ctx.restore();

  // --- the photo itself ---
  ctx.drawImage(base, OX, OY, PW, PH);
  // feather the bottom seam so the extension melts into the real sky
  const seam = ctx.createLinearGradient(0, OY + PH - 36, 0, OY + PH);
  seam.addColorStop(0, 'rgba(' + fr + ',' + fg + ',' + fb + ',0)');
  seam.addColorStop(1, 'rgba(' + fr + ',' + fg + ',' + fb + ',1)');
  ctx.fillStyle = seam;
  ctx.fillRect(0, OY + PH - 36, W, 36);

  // --- sign copy, inside the photo's own white border ---
  const cx = sx(CENTRE.x);
  const ix0 = sx(INNER.x0), ix1 = sx(INNER.x1);
  const iy0 = sy(INNER.y0), iy1 = sy(INNER.y1);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  // DETOUR placard: a small orange board pinned near the top of the panel,
  // white border of its own, soft drop shadow — like a real EXIT tab.
  const plW = 300, plH = 66;
  const plX = cx - plW / 2, plY = iy0 + 16;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.45)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 4;
  roundRectPath(ctx, plX, plY, plW, plH, 8);
  ctx.fillStyle = '#e8912d';
  ctx.fill();
  ctx.restore();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#f5f5f5';
  roundRectPath(ctx, plX + 2, plY + 2, plW - 4, plH - 4, 6);
  ctx.stroke();
  ctx.fillStyle = '#111111';
  ctx.font = '700 44px "Liberation Sans", "DejaVu Sans", sans-serif';
  ctx.fillText('DETOUR', cx, plY + 47);

  // Main legend. White, like a real sign's retroreflective legend, with a
  // hairline shadow so it holds against the bright lamp glow low on the panel.
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0,0,0,0.28)';
  ctx.shadowBlur = 2;
  ctx.shadowOffsetY = 2;
  ctx.font = '700 148px "Liberation Sans", "DejaVu Sans", sans-serif';
  try { ctx.letterSpacing = '10px'; } catch (e) { /* older canvas: ignore */ }
  ctx.fillText('GTA VI', cx, 560);
  try { ctx.letterSpacing = '0px'; } catch (e) { /* older canvas: ignore */ }

  // Second line + a drawn arrow (a shape, never a font glyph).
  ctx.font = '700 62px "Liberation Sans", "DejaVu Sans", sans-serif';
  const line2 = '13 YEARS AHEAD';
  const tw = ctx.measureText(line2).width;
  const tx = cx - 40; // shifted left so the arrow fits on the right
  ctx.fillText(line2, tx, 650);
  const ax0 = tx + tw / 2 + 18, ax1 = ax0 + 68, ay = 632;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(ax0, ay - 9);
  ctx.lineTo(ax1 - 26, ay - 9);
  ctx.lineTo(ax1 - 26, ay - 22);
  ctx.lineTo(ax1, ay);
  ctx.lineTo(ax1 - 26, ay + 22);
  ctx.lineTo(ax1 - 26, ay + 9);
  ctx.lineTo(ax0, ay + 9);
  ctx.closePath();
  ctx.fill();
  ctx.shadowColor = 'rgba(0,0,0,0)';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Thin divider, stopping well short of the sticker.
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(205, 674);
  ctx.lineTo(835, 674);
  ctx.stroke();

  // Bottom line.
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 50px "Liberation Sans", "DejaVu Sans", sans-serif';
  ctx.fillText('TOLL PAID BY make.fun', cx, 732);

  // --- ghost sticker: small, on the panel's bottom-right corner, tilted,
  // soft shadow, edges chipped so it reads as a sticker that has been there
  // a while — not a fresh badge. ---
  const gs = 140, gx = 935, gy = 715, pad = 24;
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
  console.log('panel final x', sx(PANEL.x0).toFixed(0), '..', sx(PANEL.x1).toFixed(0),
    'y', sy(PANEL.y0).toFixed(0), '..', sy(PANEL.y1).toFixed(0));
  console.log('interior final x', ix0.toFixed(0), '..', ix1.toFixed(0),
    'y', iy0.toFixed(0), '..', iy1.toFixed(0));
  console.log('bottom fill', fill);
}

main().catch((e) => { console.error('RENDER FAILED', e); process.exit(1); });
