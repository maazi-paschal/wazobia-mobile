const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 table & function
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) {
      c = 0xedb88320 ^ (c >>> 1);
    } else {
      c = c >>> 1;
    }
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createPNG(width, height, drawFn) {
  // Signature
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // 8 bit depth
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10); // Deflate
  ihdrData.writeUInt8(0, 11); // Filter
  ihdrData.writeUInt8(0, 12); // No interlace

  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Scanlines with filter byte (0)
  const rawScanlines = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;

  for (let y = 0; y < height; y++) {
    rawScanlines[offset++] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = drawFn(x, y, width, height);
      rawScanlines[offset++] = r;
      rawScanlines[offset++] = g;
      rawScanlines[offset++] = b;
      rawScanlines[offset++] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawScanlines, { level: 9 });
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + len);
  chunk.writeUInt32BE(crc32(typeAndData), 8 + len);
  return chunk;
}

// Ensure assets directory exists
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Color constants
const BG = [252, 251, 249, 255]; // #fcfbf9
const TERRACOTTA = [200, 90, 50, 255]; // #c85a32
const OBSIDIAN = [17, 17, 17, 255]; // #111111
const GOLD = [220, 175, 95, 255]; // Accent gold

// Helper to check if point (x, y) is inside the stylized letter 'W'
function isInsideW(normX, normY) {
  // normX, normY in [0, 1], centered around 0.5, 0.5
  const x = (normX - 0.5) * 2; // -1 to 1
  const y = (normY - 0.5) * 2; // -1 to 1
  
  if (y < -0.55 || y > 0.55) return false;

  const stroke = 0.13;
  // Stroke 1: from (-0.7, -0.5) to (-0.35, 0.5) -> slope
  const dist1 = Math.abs((x - (-0.7)) * 1.0 - (y - (-0.5)) * 0.35);
  // Stroke 2: from (-0.35, 0.5) to (0.0, -0.15)
  const dist2 = Math.abs((x - (-0.35)) * (-0.65) - (y - 0.5) * 0.35);
  // Stroke 3: from (0.0, -0.15) to (0.35, 0.5)
  const dist3 = Math.abs((x - 0.0) * 0.65 - (y - (-0.15)) * 0.35);
  // Stroke 4: from (0.35, 0.5) to (0.7, -0.5)
  const dist4 = Math.abs((x - 0.35) * (-1.0) - (y - 0.5) * 0.35);

  const onStroke1 = (x >= -0.75 && x <= -0.3) && dist1 < stroke;
  const onStroke2 = (x >= -0.4 && x <= 0.05) && dist2 < stroke && y >= -0.25;
  const onStroke3 = (x >= -0.05 && x <= 0.4) && dist3 < stroke && y >= -0.25;
  const onStroke4 = (x >= 0.3 && x <= 0.75) && dist4 < stroke;

  return onStroke1 || onStroke2 || onStroke3 || onStroke4;
}

// 1. App Icon (1024x1024)
console.log('Generating assets/icon.png...');
const iconBuf = createPNG(1024, 1024, (x, y, w, h) => {
  const normX = x / w;
  const normY = y / h;
  const dx = normX - 0.5;
  const dy = normY - 0.5;
  const r = Math.sqrt(dx * dx + dy * dy);

  // Outer circle border
  if (r >= 0.38 && r <= 0.40) {
    return TERRACOTTA;
  }
  // Inner circle filled medallion
  if (r < 0.38) {
    if (isInsideW(normX, normY)) {
      return [252, 251, 249, 255]; // Off-white W
    }
    return OBSIDIAN; // Dark background inside circle
  }

  return BG;
});
fs.writeFileSync(path.join(assetsDir, 'icon.png'), iconBuf);

// 2. Adaptive Icon (Foreground) (1024x1024)
console.log('Generating assets/adaptive-icon.png...');
const adaptiveBuf = createPNG(1024, 1024, (x, y, w, h) => {
  const normX = x / w;
  const normY = y / h;
  const dx = normX - 0.5;
  const dy = normY - 0.5;
  const r = Math.sqrt(dx * dx + dy * dy);

  if (r >= 0.28 && r <= 0.30) {
    return TERRACOTTA;
  }
  if (r < 0.28) {
    if (isInsideW((normX - 0.5) * 1.35 + 0.5, (normY - 0.5) * 1.35 + 0.5)) {
      return [252, 251, 249, 255];
    }
    return OBSIDIAN;
  }
  return [0, 0, 0, 0]; // Transparent background for adaptive foreground
});
fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.png'), adaptiveBuf);

// 3. Splash Screen (1024x1024)
console.log('Generating assets/splash.png...');
const splashBuf = createPNG(1024, 1024, (x, y, w, h) => {
  const normX = x / w;
  const normY = y / h;
  const dx = normX - 0.5;
  const dy = normY - 0.45;
  const r = Math.sqrt(dx * dx + dy * dy);

  if (r >= 0.22 && r <= 0.235) {
    return TERRACOTTA;
  }
  if (r < 0.22) {
    if (isInsideW((normX - 0.5) * 1.7 + 0.5, (normY - 0.45) * 1.7 + 0.5)) {
      return [252, 251, 249, 255];
    }
    return OBSIDIAN;
  }

  return BG;
});
fs.writeFileSync(path.join(assetsDir, 'splash.png'), splashBuf);

// 4. Favicon (48x48)
console.log('Generating assets/favicon.png...');
const faviconBuf = createPNG(48, 48, (x, y, w, h) => {
  const normX = x / w;
  const normY = y / h;
  const dx = normX - 0.5;
  const dy = normY - 0.5;
  const r = Math.sqrt(dx * dx + dy * dy);

  if (r < 0.45) {
    if (isInsideW(normX, normY)) {
      return [252, 251, 249, 255];
    }
    return TERRACOTTA;
  }
  return [0, 0, 0, 0];
});
fs.writeFileSync(path.join(assetsDir, 'favicon.png'), faviconBuf);

console.log('All assets generated successfully!');
