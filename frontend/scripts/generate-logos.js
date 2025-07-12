const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Function to create a todo-themed logo
function drawLogo(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#3f51b5'; // Material UI primary color
  ctx.fillRect(0, 0, size, size);

  // Checklist lines
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = size * 0.05;
  
  // Draw three lines representing a todo list
  const lineSpacing = size * 0.2;
  const startY = size * 0.3;
  
  for (let i = 0; i < 3; i++) {
    const y = startY + (i * lineSpacing);
    ctx.beginPath();
    ctx.moveTo(size * 0.3, y);
    ctx.lineTo(size * 0.7, y);
    ctx.stroke();
  }

  // Checkmark
  ctx.strokeStyle = '#4caf50'; // Material UI success color
  ctx.lineWidth = size * 0.08;
  ctx.beginPath();
  ctx.moveTo(size * 0.3, size * 0.5);
  ctx.lineTo(size * 0.45, size * 0.65);
  ctx.lineTo(size * 0.7, size * 0.35);
  ctx.stroke();

  return canvas;
}

// Ensure the public directory exists
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate PNG logos
[192, 512].forEach(size => {
  const canvas = drawLogo(size);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(publicDir, `logo${size}.png`), buffer);
  console.log(`Generated logo${size}.png`);
});

// Generate favicon.ico (we'll use the 64x64 version for simplicity)
const faviconCanvas = drawLogo(64);
const faviconBuffer = faviconCanvas.toBuffer('image/png');
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), faviconBuffer);
console.log('Generated favicon.ico');

console.log('Logo generation complete!'); 