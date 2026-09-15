// Minimal 8-bit-RGBA PNG codec, zero dependencies (node:zlib only).
//
// Shared by slice-character.mjs and extract-frames.mjs, which both need to cut rectangles out of a
// PixelLab spritesheet and write them back out. Nothing here is general-purpose: it handles exactly
// the PNGs PixelLab returns (colour type 6, bit depth 8, non-interlaced) and refuses anything else
// loudly rather than producing a subtly wrong image.

import { inflateSync, deflateSync } from 'node:zlib';

export const SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const CRC = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c; }
  return t;
})();
const crc32 = b => { let c = -1; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };

export function decodePNG(buf) {
  if (!buf.subarray(0, 8).equals(SIG)) throw new Error('not a PNG');
  let p = 8, w, h, bd, ct, il; const idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p), type = buf.toString('ascii', p + 4, p + 8);
    const data = buf.subarray(p + 8, p + 8 + len);
    if (type === 'IHDR') { w = data.readUInt32BE(0); h = data.readUInt32BE(4); bd = data[8]; ct = data[9]; il = data[12]; }
    else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    p += 12 + len;
  }
  if (bd !== 8 || ct !== 6) throw new Error(`need 8-bit RGBA, got bitDepth=${bd} colorType=${ct}`);
  if (il) throw new Error('interlaced PNG unsupported');
  const raw = inflateSync(Buffer.concat(idat)), stride = w * 4, out = Buffer.alloc(h * stride);
  let ro = 0;
  for (let y = 0; y < h; y++) {
    const f = raw[ro++], line = raw.subarray(ro, ro + stride); ro += stride;
    const cur = out.subarray(y * stride, (y + 1) * stride);
    const prev = y > 0 ? out.subarray((y - 1) * stride, y * stride) : null;
    for (let x = 0; x < stride; x++) {
      const a = x >= 4 ? cur[x - 4] : 0, b = prev ? prev[x] : 0, c = prev && x >= 4 ? prev[x - 4] : 0;
      let v = line[x];
      if (f === 1) v = (v + a) & 255;
      else if (f === 2) v = (v + b) & 255;
      else if (f === 3) v = (v + ((a + b) >> 1)) & 255;
      else if (f === 4) {
        const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c);
        v = (v + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 255;
      } else if (f !== 0) throw new Error('bad filter ' + f);
      cur[x] = v;
    }
  }
  return { w, h, data: out };
}

export function encodePNG({ w, h, data }) {
  const stride = w * 4, raw = Buffer.alloc(h * (stride + 1));
  for (let y = 0; y < h; y++) { raw[y * (stride + 1)] = 0; data.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride); }
  const chunk = (type, d) => {
    const b = Buffer.alloc(12 + d.length);
    b.writeUInt32BE(d.length, 0); b.write(type, 4, 'ascii'); d.copy(b, 8);
    b.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type, 'ascii'), d])), 8 + d.length);
    return b;
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([SIG, chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}

export const blank = (w, h) => ({ w, h, data: Buffer.alloc(w * h * 4) });

export function blit(dst, src, sx, sy, w, h, dx, dy) {
  for (let y = 0; y < h; y++)
    src.data.copy(dst.data, ((dy + y) * dst.w + dx) * 4, ((sy + y) * src.w + sx) * 4, ((sy + y) * src.w + sx + w) * 4);
}

// True when every pixel in the rect is fully transparent — used to reject padding cells that a
// spritesheet row reserves but never fills.
export function isEmpty(img, sx, sy, w, h) {
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (img.data[((sy + y) * img.w + sx + x) * 4 + 3] !== 0) return false;
  return true;
}
