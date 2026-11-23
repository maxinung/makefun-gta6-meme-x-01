// create-sign.js — renders the GTA 6 "DETOUR" road-sign meme.
// A highway sign says the road to GTA VI has been diverted for 13 years,
// and the make.fun ghost works the road as a flagger, holding its own
// paddle sign. Node 22 + canvas. Run: node create-sign.js
// Reads mark-1024.png from this directory. Writes meme.png (1200x1200)
// and meme_480.png (480x480) into the current directory.

const { createCanvas, loadImage } = require('canvas');
const fs = require('node:fs');

const W = 1200;
const H = 1200;

// Two accents + neutrals. Green is the sign's own field colour, orange is
// the detour warning, magenta comes from the ghost mark itself.
const SKY_TOP = '#0f0f2c';
const SKY_HORIZON = '#3a2a5e';
const ASPHALT = '#1e1e26';
const SIGN_GREEN = '#00703c';
const DETOUR_ORANGE = '#e87722';
const INK = '#141414';
const PAPER = '#ffffff';
const DASH_YELLOW = '#f2c200';
const POST_GRAY = '#8f9299';
const POLE_GRAY = '#9aa0a8';
const WINDOW_GOLD = '#ffd76a';
const MOON = '#f2ecd8';

const SIGN = { x: 100, y: 180, w: 1000, h: 640, r: 24 };
const BAND_H = 120; // orange DETOUR strip at the top of the sign
const HORIZON = 920; // where the sky meets the road

// Stars in the night sky above the sign, plus a few down the sides.
const STARS = [
  [80, 60, 2], [200, 40, 2.5], [320, 90, 2], [450, 50, 3], [560, 110, 2],
  [700, 60, 2.5], [820, 100, 2], [940, 45, 2], [1120, 130, 2.5], [150, 130, 2],
  [380, 140, 2], [660, 150, 2], [980, 160, 2], [60, 150, 2.5], [1150, 60, 2],
  [500, 30, 2], [40, 300, 2], [60, 520, 2.5], [30, 760, 2],
  [1160, 320, 2], [1170, 560, 2.5], [1155, 780, 2],
];

// Vice City skyline silhouettes along the horizon: [x, width, height].
// The sign covers the middle ones; the sides and the short ones peek out.
const BUILDINGS = [
  [0, 90, 120], [95, 70, 170], [170, 110, 95], [285, 80, 150],
  [370, 95, 80], [470, 70, 130], [545, 100, 90], [650, 85, 160],
  [740, 95, 75], [840, 70, 140], [915, 90, 100], [1010, 75, 155],
  [1090, 110, 85],
];

function paintSky(ctx) {
  const grad = ctx.createLinearGradient(0, 0, 0, HORIZON);
  grad.addColorStop(0, SKY_TOP);
  grad.addColorStop(1, SKY_HORIZON);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, HORIZON);

  // Moon, top left, balancing the ghost flagger at bottom right.
  ctx.fillStyle = 'rgba(242, 236, 216, 0.14)';
  ctx.beginPath(); ctx.arc(150, 95, 54, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = MOON;
  ctx.beginPath(); ctx.arc(150, 95, 38, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = PAPER;
  for (const [x, y, r] of STARS) {
    ctx.globalAlpha = 0.55 + (r - 2) * 0.2;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function paintSkyline(ctx) {
  BUILDINGS.forEach(([bx, bw, bh], bi) => {
    const by = HORIZON - bh;
    ctx.fillStyle = '#0a0a18';
    ctx.fillRect(bx, by, bw, bh);
    // Lit windows in a fixed pattern, so every render is identical.
    ctx.fillStyle = WINDOW_GOLD;
    const cols = Math.floor((bw - 16) / 16);
    const rows = Math.floor((bh - 16) / 22);
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        if ((c * 3 + r * 2 + bi) % 4 === 0) continue;
        ctx.globalAlpha = 0.85;
        ctx.fillRect(bx + 10 + c * 16, by + 10 + r * 22, 6, 8);
      }
    }
    ctx.globalAlpha = 1;
  });
}

function paintRoad(ctx) {
  ctx.fillStyle = ASPHALT;
  ctx.fillRect(0, HORIZON, W, H - HORIZON);
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, HORIZON, W, 4);
  ctx.fillStyle = DASH_YELLOW;
  for (let x = 30; x < W; x += 130) {
    ctx.fillRect(x, 1058, 70, 10);
  }
}

function paintSign(ctx) {
  // Green panel with rounded corners.
  ctx.beginPath();
  ctx.roundRect(SIGN.x, SIGN.y, SIGN.w, SIGN.h, SIGN.r);
  ctx.fillStyle = SIGN_GREEN;
  ctx.fill();

  // Orange DETOUR strip across the top, clipped to the panel's curve.
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(SIGN.x, SIGN.y, SIGN.w, SIGN.h, SIGN.r);
  ctx.clip();
  ctx.fillStyle = DETOUR_ORANGE;
  ctx.fillRect(SIGN.x, SIGN.y, SIGN.w, BAND_H);
  ctx.restore();

  // White frame, outer thick and inner thin, like a real highway sign.
  ctx.beginPath();
  ctx.roundRect(SIGN.x, SIGN.y, SIGN.w, SIGN.h, SIGN.r);
  ctx.strokeStyle = PAPER;
  ctx.lineWidth = 10;
  ctx.stroke();
  ctx.beginPath();
  ctx.roundRect(SIGN.x + 20, SIGN.y + 20, SIGN.w - 40, SIGN.h - 40, 16);
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // 1. DETOUR — the joke's frame, black on orange.
  ctx.font = '900 96px "DejaVu Sans", sans-serif';
  ctx.fillStyle = INK;
  ctx.fillText('DETOUR', W / 2, SIGN.y + BAND_H / 2);

  // 2. GTA VI — the largest thing on the sign, the first thing the eye hits.
  ctx.font = '900 150px "DejaVu Sans", sans-serif';
  ctx.fillStyle = PAPER;
  ctx.fillText('GTA VI', W / 2, 430);

  // 3. The punchline: the destination is still 13 years away.
  ctx.font = '800 64px "DejaVu Sans", sans-serif';
  ctx.fillText('13 YEARS AHEAD \u2192', W / 2, 575);

  // 4. Divider, then the sell: make.fun pays the toll.
  ctx.strokeStyle = PAPER;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(220, 645);
  ctx.lineTo(980, 645);
  ctx.stroke();

  const lead = 'TOLL PAID BY ';
  const brand = 'make.fun';
  ctx.font = '400 46px "DejaVu Sans", sans-serif';
  const leadW = ctx.measureText(lead).width;
  ctx.font = '800 46px "DejaVu Sans", sans-serif';
  const brandW = ctx.measureText(brand).width;
  let x = W / 2 - (leadW + brandW) / 2;
  ctx.textAlign = 'left';
  ctx.font = '400 46px "DejaVu Sans", sans-serif';
  ctx.fillText(lead, x, 735);
  ctx.font = '800 46px "DejaVu Sans", sans-serif';
  ctx.fillText(brand, x + leadW, 735);
}

function paintPosts(ctx) {
  ctx.fillStyle = POST_GRAY;
  ctx.fillRect(250, SIGN.y + SIGN.h, 40, 140);
  ctx.fillRect(910, SIGN.y + SIGN.h, 40, 140);
}

function paintGhostFlagger(ctx, ghost) {
  // The ghost works the road: its mark is the paddle on a pole,
  // standing on the asphalt at the sign's right side.
  const cx = 1080;
  const cy = 960;
  const d = 180;
  ctx.fillStyle = POLE_GRAY;
  ctx.fillRect(cx - 7, cy + d / 2 - 10, 14, 120);
  ctx.drawImage(ghost, cx - d / 2, cy - d / 2, d, d);
  ctx.beginPath();
  ctx.arc(cx, cy, d / 2 + 2, 0, Math.PI * 2);
  ctx.strokeStyle = PAPER;
  ctx.lineWidth = 4;
  ctx.stroke();
}

async function main() {
  const ghost = await loadImage('mark-1024.png');

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  paintSky(ctx);
  paintSkyline(ctx);
  paintRoad(ctx);
  paintPosts(ctx);
  paintSign(ctx);
  paintGhostFlagger(ctx, ghost);
  fs.writeFileSync('meme.png', canvas.toBuffer('image/png'));

  const small = createCanvas(480, 480);
  small.getContext('2d').drawImage(canvas, 0, 0, 480, 480);
  fs.writeFileSync('meme_480.png', small.toBuffer('image/png'));

  console.log('meme.png', fs.statSync('meme.png').size, 'bytes, 1200x1200');
  console.log('meme_480.png', fs.statSync('meme_480.png').size, 'bytes, 480x480');
}

main().catch((err) => { console.error(err); process.exit(1); });
