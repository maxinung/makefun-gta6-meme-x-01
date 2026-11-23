const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

async function createMeme() {
  const width = 1200;
  const height = 1200;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // ===== COLOR PALETTE =====
  // Ink black: #000000
  // Paper white: #ffffff
  // One accent: magenta (make.fun only) - used sparingly
  const INK_BLACK = '#000000';
  const PAPER_WHITE = '#ffffff';
  const DARK_NAVY = '#0a0a2e';
  const ACCENT_MAGENTA = '#ff6b6b'; // make.fun magenta accent

  // ===== BACKGROUND =====
  ctx.fillStyle = DARK_NAVY;
  ctx.fillRect(0, 0, width, height);

  // ===== PAPER STRIP =====
  // Centered white paper strip, fills frame vertically
  const paperLeft = 150;
  const paperTop = 380;
  const paperWidth = 900;
  const paperHeight = 460; // 380 + 460 = 840, centered: 380px dark frame top and bottom
  const paperRight = paperLeft + paperWidth; // 1050
  const paperBottom = paperTop + paperHeight; // 1140

  ctx.fillStyle = PAPER_WHITE;
  ctx.fillRect(paperLeft, paperTop, paperWidth, paperHeight);

  // ===== GHOST IMAGE =====
  const ghost = await loadImage('mark-1024.png');
  const ghostSize = 50; // postage stamp size, not a badge

  // Ghost in header, next to issuer name
  const ghostX = paperLeft + 30; // placed near the start of the header line
  const ghostY = paperTop + 35; // vertically centered in header area

  // Draw ghost - integrated as part of the design logo
  ctx.drawImage(ghost, ghostX, ghostY, ghostSize, ghostSize);

  // ===== TYPOGRAPHY SETUP =====
  // Max 2 typefaces: monospace for body, one bold face for total
  // All text uses monospace; "bold" weight for the total due
  ctx.font = '20px monospace';
  ctx.textAlign = 'left';
  ctx.fillStyle = INK_BLACK;

  // ===== HEADER: ISSUER NAME + GHOST =====
  // "Leonida Parking Authority, Vice City"
  // The ghost is the receipt's own logo, postage stamp size, next to the name
  ctx.font = 'bold 32px monospace';
  ctx.fillText('Leonida Parking Authority', paperLeft + 100, paperTop + 70);

  ctx.font = '20px monospace';
  ctx.fillText('Vice City', paperLeft + 100, paperTop + 95);

  // ===== DATE / "PARKED SINCE 2013" LINE =====
  // This is the secondary focal point after total due
  ctx.font = 'bold 28px monospace';
  ctx.fillText('Parked since 17 September 2013', paperLeft + 50, paperTop + 130);

  // ===== ITEMIZED ROWS =====
  // Each row: label and value, with ruled line below
  let yPos = paperTop + 180; // start below the "parked since" line
  const rowHeight = 36; // consistent grid height per row
  const labelX = paperLeft + 50; // left-aligned, inside paper
  const valueX = paperLeft + 700; // value area - shifted right
  const fineValue = '$69,420';
  const lateFeesValue = '$1,337,000';
  const totalValue = '$1,406,420';

  // Helper: draw one row with label, value, and ruled line
  function drawRow(label, value, fontSize = 20) {
    // Draw label
    ctx.save();
    ctx.font = `${fontSize}px monospace`;
    ctx.fillStyle = INK_BLACK;
    ctx.textAlign = 'left';
    ctx.fillText(label, labelX, yPos);
    // Draw value
    ctx.textAlign = 'right';
    ctx.fillText(value, paperRight - 50, yPos);
    ctx.restore();

    // Ruled line below the row (grid alignment)
    const lineY = yPos + 7;
    ctx.strokeStyle = INK_BLACK;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(labelX, lineY);
    ctx.lineTo(paperRight - 50, lineY);
    ctx.stroke();

    return yPos + rowHeight;
  }

  // Fine row
  yPos = drawRow('Fine:', fineValue, 22);

  // Late fees row
  yPos = drawRow('Late fees:', lateFeesValue, 22);

  // ===== TOTAL DUE (LARGEST TYPE - focal point) =====
  // This is the first thing the eye hits per the hierarchy test
  yPos += 40; // space after last ruled line
  ctx.font = 'bold 48px monospace'; // largest type on the receipt
  ctx.textAlign = 'right';
  ctx.fillText('TOTAL DUE:', paperRight - 50, yPos);
  ctx.font = 'bold 48px monospace';
  ctx.textAlign = 'right';
  ctx.fillText(totalValue, paperRight - 50, yPos + 40);

  // Make the total due stand out even more - add a highlight underline
  ctx.strokeStyle = INK_BLACK;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(paperRight - 100, yPos + 50);
  ctx.lineTo(paperRight - 10, yPos + 50);
  ctx.stroke();

  // ===== FOOTER: PAYMENT INFO & PLAY CODE =====
  yPos += 80;
  ctx.font = '18px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('Paid with make.fun bounty winnings', labelX, yPos);

  yPos += 28;
  ctx.fillText('Play code: makefun-pomelo-pastry-cascade', labelX, yPos);

  yPos += 28;
  ctx.fillText('make.fun', labelX, yPos);

  // ===== PERFORATED EDGE at bottom of paper =====
  // Draw a dashed/perforated line at the bottom of the paper
  const perforationY = paperBottom - 10;
  ctx.strokeStyle = INK_BLACK;
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]); // dashed line for perforation
  ctx.beginPath();
  ctx.moveTo(paperLeft, perforationY);
  ctx.lineTo(paperRight, perforationY);
  ctx.stroke();
  ctx.setLineDash([]); // reset

  // ===== SAVE =====
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('meme.png', buffer);
  console.log('Meme saved as meme.png');
  console.log(`Size: ${width}x${height}`);
}

createMeme().catch(console.error);