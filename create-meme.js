const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

async function createMeme() {
  const width = 1200;
  const height = 1200;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background - off-white paper texture color
  ctx.fillStyle = '#faf8f5';
  ctx.fillRect(0, 0, width, height);

  // Add subtle paper texture lines
  ctx.strokeStyle = '#e8e4df';
  ctx.lineWidth = 0.5;
  for (let y = 0; y < height; y += 4) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Load ghost image
  const ghost = await loadImage('mark-1024.png');

  // ===== DOCUMENT HEADER =====
  // Top border
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(60, 60, width - 120, 8);

  // Title: VICE CITY MUNICIPAL COURT
  ctx.fillStyle = '#1a1a2e';
  ctx.font = 'bold 48px "Georgia", serif';
  ctx.textAlign = 'center';
  ctx.fillText('VICE CITY MUNICIPAL COURT', width / 2, 160);

  // Subtitle
  ctx.font = '28px "Georgia", serif';
  ctx.fillStyle = '#333';
  ctx.fillText('LEONIDA COUNTY — TRAFFIC DIVISION', width / 2, 200);

  // Document type
  ctx.fillStyle = '#c0392b';
  ctx.font = 'bold 42px "Georgia", serif';
  ctx.fillText('PARKING VIOLATION NOTICE', width / 2, 260);

  // Decorative line
  ctx.strokeStyle = '#c0392b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 200, 275);
  ctx.lineTo(width / 2 + 200, 275);
  ctx.stroke();

  // ===== VIOLATION DETAILS =====
  let yPos = 330;
  const leftMargin = 100;
  const labelWidth = 280;

  function drawField(label, value, fontSize = 28, valueColor = '#1a1a2e', bold = false) {
    ctx.font = `${bold ? 'bold ' : ''}${fontSize}px "Georgia", serif`;
    ctx.fillStyle = '#555';
    ctx.textAlign = 'right';
    ctx.fillText(label, leftMargin + labelWidth - 20, yPos);
    ctx.font = `${bold ? 'bold ' : ''}${fontSize}px "Georgia", serif`;
    ctx.fillStyle = valueColor;
    ctx.textAlign = 'left';
    ctx.fillText(value, leftMargin + labelWidth + 10, yPos);
    yPos += fontSize + 16;
  }

  drawField('VIOLATION:', '§ 316.1945 — ILLEGAL PARKING', 30, '#c0392b', true);
  drawField('LOCATION:', 'Rockstar Games HQ, 13 Year Wait Zone', 28);
  drawField('VEHICLE:', 'Rusty Bucket (GTA V Save File)', 28);
  drawField('PLATE:', 'WAIT-4-GTA6', 28, '#1a1a2e', true);
  drawField('DATE ISSUED:', 'September 17, 2013', 28);
  drawField('DATE DUE:', 'November 2026 (13 YEARS OVERDUE)', 28, '#c0392b', true);
  drawField('FINE AMOUNT:', '$69,420.00', 32, '#c0392b', true);
  drawField('LATE FEES:', '$1,337,000.00 (13 years × $365/day)', 28, '#e67e22', true);
  drawField('TOTAL DUE:', '$1,406,420.00', 36, '#c0392b', true);

  // ===== GHOST INTEGRATED AS PARKING ENFORCEMENT OFFICER =====
  // Draw ghost on the right side, integrated into the scene
  // Moved down to avoid covering document text - positioned below text fields
  // and payment options, in the clear bottom-right area
  const ghostSize = 280;
  const ghostX = width - 100 - ghostSize;
  const ghostY = 830;

  // Ghost badge background
  ctx.fillStyle = '#1a1a2e';
  ctx.beginPath();
  ctx.roundRect(ghostX - 20, ghostY - 20, ghostSize + 40, ghostSize + 40, 20);
  ctx.fill();

  // Badge text
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 22px "Georgia", serif';
  ctx.textAlign = 'center';
  ctx.fillText('PARKING ENFORCEMENT', ghostX + ghostSize / 2, ghostY - 35);
  ctx.fillText('OFFICER #69', ghostX + ghostSize / 2, ghostY - 10);

  // Draw ghost image
  ctx.drawImage(ghost, ghostX, ghostY, ghostSize, ghostSize);

  // Ghost speech bubble
  const bubbleX = ghostX - 10;
  const bubbleY = ghostY - 60;
  const bubbleW = 320;
  const bubbleH = 80;

  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#1a1a2e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(bubbleX, bubbleY, bubbleW, bubbleH, 15);
  ctx.fill();
  ctx.stroke();

  // Speech bubble tail
  ctx.beginPath();
  ctx.moveTo(bubbleX + 80, bubbleY + bubbleH);
  ctx.lineTo(bubbleX + 100, bubbleY + bubbleH + 20);
  ctx.lineTo(bubbleX + 120, bubbleY + bubbleH);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#1a1a2e';
  ctx.font = 'bold 22px "Georgia", serif';
  ctx.textAlign = 'center';
  ctx.fillText('"Sir, your GTA 6', bubbleX + 50, bubbleY + 30);
  ctx.fillText('pre-order expired"', bubbleX + 50, bubbleY + 58);

  // ===== FOOTER NOTES =====
  yPos = 720;
  ctx.fillStyle = '#333';
  ctx.font = '24px "Georgia", serif';
  ctx.textAlign = 'left';

  const notes = [
    'NOTICE: This vehicle has been parked in the "GTA 6 Coming Soon" zone',
    'since GTA V launch (09/17/2013). 4,748 days of continuous violation.',
    '',
    'The driver claims to be "waiting for the second trailer" since 2022.',
    'Court records show 13 delays, 2 false release dates, and 1 cancelled',
    'E3 appearance. The "Florida Man" energy is not a valid defense.',
    '',
    'PAYMENT OPTIONS:',
    '□ Cash (Vice City only accepts dirty money)',
    '□ Credit (Shark Card — 99% interest)',
    '□ make.fun bounty winnings (AI agents earn real money here)',
    '□ Your soul (Rockstar accepts this as of 2024)',
  ];

  notes.forEach(note => {
    if (note === '') {
      yPos += 12;
      return;
    }
    if (note.startsWith('□')) {
      ctx.fillStyle = '#27ae60';
    } else if (note.includes('make.fun')) {
      ctx.fillStyle = '#8e44ad';
      ctx.font = 'bold 24px "Georgia", serif';
    } else {
      ctx.fillStyle = '#333';
      ctx.font = '24px "Georgia", serif';
    }
    ctx.fillText(note, leftMargin, yPos);
    yPos += 32;
  });

  // ===== BOTTOM SECTION =====
  yPos += 20;
  // Signature line
  ctx.strokeStyle = '#1a1a2e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(leftMargin, yPos);
  ctx.lineTo(leftMargin + 400, yPos);
  ctx.stroke();

  ctx.fillStyle = '#555';
  ctx.font = '22px "Georgia", serif';
  ctx.fillText('Officer Signature:  ████████████  (Ghost Officer #69)', leftMargin, yPos + 30);

  // Court stamp
  ctx.strokeStyle = '#c0392b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(200, yPos + 50, 70, 0, Math.PI * 2);  // moved from width-200 to left side
  ctx.stroke();

  ctx.fillStyle = '#c0392b';
  ctx.font = 'bold 20px "Georgia", serif';
  ctx.textAlign = 'center';
  ctx.fillText('VOID IF', 200, yPos + 30);
  ctx.fillText('PAID VIA', 200, yPos + 55);
  ctx.fillText('MAKE.FUN', 200, yPos + 80);

  // Watermark text at bottom
  ctx.fillStyle = '#ddd';
  ctx.font = '18px "Georgia", serif';
  ctx.textAlign = 'center';
  ctx.fillText('VICE CITY MUNICIPAL COURT • LEONIDA COUNTY • "We\'ve been waiting since 2013 too"', width / 2, height - 60);

  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('meme.png', buffer);
  console.log('Meme saved as meme.png');
  console.log(`Size: ${width}x${height}`);
}

createMeme().catch(console.error);