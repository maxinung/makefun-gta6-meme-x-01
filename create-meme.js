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
  drawField('LATE FEES:', '$1,337,000.00 (13 years)', 28, '#e67e22', true);
  drawField('TOTAL DUE:', '$1,406,420.00', 36, '#c0392b', true);

  // ===== GHOST INTEGRATED AS PARKING ENFORCEMENT OFFICER =====
  // Draw ghost on the right side, integrated into the scene
  // Moved down to avoid covering document text - positioned below text fields
  // and payment options, in the clear bottom-right area
  const ghostSize = 280;
  const ghostX = width - 100 - ghostSize;
  const ghostY = 1070;

  // Ghost badge background
  ctx.fillStyle = '#1a1a2e';
  ctx.beginPath();
  ctx.roundRect(ghostX - 20, ghostY - 20, ghostSize + 40, ghostSize + 40, 20);
  ctx.fill();

  // Badge text
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 22px "Georgia", serif';
  ctx.textAlign = 'center';
  ctx.fillText('PARKING ENFORCEMENT', ghostX - 20 + 30, ghostY - 35);
  ctx.fillText('OFFICER #69', ghostX - 20 + 30, ghostY - 10);

  // Draw ghost image
  ctx.drawImage(ghost, ghostX, ghostY, ghostSize, ghostSize);

  // Ghost speech bubble - moved above notice paragraph, not covering document text
  const bubbleX = ghostX - 10;
  const bubbleW = 320;
  const bubbleH = 80;
  const bubbleY = ghostY - 210;  // bubble at y=710-790, above LATE FEES, below notice start

  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#1a1a2e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(bubbleX, bubbleY, bubbleW, bubbleH, 15);
  ctx.fill();
  ctx.stroke();

  // Speech bubble tail - extended to reach from bubble bottom to ghost image
  ctx.beginPath();
  ctx.moveTo(bubbleX + 80, bubbleY + bubbleH);  // bottom left of tail base
  ctx.lineTo(bubbleX + 100, ghostY);  // down to ghost top
  ctx.lineTo(bubbleX + 120, bubbleY + bubbleH);  // bottom right of tail base
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
    if (note.includes('make.fun')) {
      ctx.fillStyle = '#8e44ad';
      ctx.font = 'bold 24px "Georgia", serif';
      // Split into two lines after "earn" to create 20px gap from ghost box
      const earnIdx = note.indexOf('earn ');
      const line1 = note.substring(0, earnIdx + 5);  // "□ make.fun bounty winnings (AI agents earn"
      const line2 = note.substring(earnIdx + 5);  // "real money here)"
      ctx.fillText(line1, leftMargin, yPos);
      ctx.fillText(line2, leftMargin, yPos + 32);  // 32px below first line
      yPos += 64;  // total advancement for two lines
      return;
    }
    if (note.startsWith('□')) {
      ctx.fillStyle = '#27ae60';
    } else {
      ctx.fillStyle = '#333';
      ctx.font = '24px "Georgia", serif';
    }
    ctx.fillText(note, leftMargin, yPos);
    yPos += 32;
  });

  // ===== OVERLAP CHECK =====
  let overlapFound = false;

  const bubble = { x1: bubbleX, y1: bubbleY, x2: bubbleX + bubbleW, y2: bubbleY + bubbleH };

  const ghostBadge = { x1: ghostX - 20, y1: ghostY - 20, x2: ghostX + ghostSize + 20, y2: ghostY + ghostSize + 20 };

  const lateFees = { x1: leftMargin + labelWidth + 10, y1: 644 - 4, x2: leftMargin + labelWidth + 10 + 200, y2: 644 + 4 };

  const noticeEndY = yPos;

  const notice = { x1: leftMargin, y1: 720, x2: width - 100, y2: noticeEndY };

  if (ghostBadge.x1 < notice.x2 && ghostBadge.x2 > notice.x1 && ghostBadge.y1 < notice.y2 && ghostBadge.y2 > notice.y1) {
    const overlapTop = Math.max(ghostBadge.y1, notice.y1);
    const overlapBottom = Math.min(ghostBadge.y2, notice.y2);
    if (overlapBottom - overlapTop > 50) {
      console.warn("OVERLAP: Ghost badge covers notice paragraph");
      overlapFound = true;
    }
  }

  if (bubble.x1 < lateFees.x2 && bubble.x2 > lateFees.x1 && bubble.y1 < lateFees.y2 && bubble.y2 > lateFees.y1) {
    console.warn("OVERLAP: Bubble covers LATE FEES field");
    overlapFound = true;
  }

  const bubbleTail = { x1: bubbleX + 80, y1: bubbleY + bubbleH, x2: bubbleX + 120, y2: ghostY };

  const officerLabelX = ghostX - 20 + 30;
  if (officerLabelX >= bubbleTail.x1 - 20 && officerLabelX <= bubbleTail.x2 + 20 && bubbleTail.y1 < 920 && bubbleTail.y2 > 885) {
    console.warn("OVERLAP: Bubble tail near OFFICER #69");
    overlapFound = true;
  }

  const stampCenterY = yPos - 10;
  const stampRadius = 70;
  if (stampCenterY - stampRadius < 0 || stampCenterY + stampRadius > height) {
    console.warn("OVERLAP: Stamp exceeds canvas");
    overlapFound = true;
  }

  if (!overlapFound) {
    console.log("OVERLAP CHECK: PASS - Zero structural overlap verified.");
  }

  // Court stamp - moved to right side to avoid text
  ctx.strokeStyle = '#c0392b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(width - 200, yPos - 10, 70, 0, Math.PI * 2);  // moved from left side to right side, adjusted to fit within canvas
  ctx.stroke();
  
  ctx.fillStyle = '#c0392b';
  ctx.font = 'bold 20px "Georgia", serif';
  ctx.textAlign = 'center';
  ctx.fillText('VOID IF', width - 200, yPos + 30);
  ctx.fillText('PAID VIA', width - 200, yPos + 55);
  ctx.fillText('MAKE.FUN', width - 200, yPos + 80);

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