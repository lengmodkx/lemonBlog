/**
 * 从 JPEG / ARW（TIFF 结构）提取 EXIF 拍摄信息，供 content/travel/photos.json 导入用。
 *
 * 用法:
 *   node scripts/extract-exif.js <image> [more images...]
 *
 * 输出 JSON：拍摄时间、机身、镜头、GPS（若有）。
 */
const fs = require('fs');
const path = require('path');

function extract(file) {
  const buf = fs.readFileSync(file);
  let le = false; // byte order flag, resolved after the TIFF header base is known
  const u16 = (o) => (le ? buf.readUInt16LE(o) : buf.readUInt16BE(o));
  const u32 = (o) => (le ? buf.readUInt32LE(o) : buf.readUInt32BE(o));

  const TYPE_SIZES = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 };

  // TIFF header base: ARW/TIFF at 0, JPEG inside APP1 after "Exif\0\0".
  let base = 0;

  function readValue(type, count, valueOffset) {
    const size = (TYPE_SIZES[type] || 1) * count;
    const off = size <= 4 ? valueOffset : base + u32(valueOffset);
    if (type === 2) return buf.toString('ascii', off, off + count - 1);
    if (type === 3) return u16(off);
    if (type === 4) return u32(off);
    if (type === 5) {
      const out = [];
      for (let i = 0; i < count; i++) out.push(u32(off + i * 8) / u32(off + i * 8 + 4));
      return out;
    }
    return null;
  }

  function readIFD(offset) {
    const entries = u16(offset);
    const tags = {};
    for (let i = 0; i < entries; i++) {
      const e = offset + 2 + i * 12;
      const tag = u16(e);
      const type = u16(e + 2);
      const count = u32(e + 4);
      tags[tag] = { type, count, value: readValue(type, count, e + 8) };
    }
    return tags;
  }

  // JPEG: locate APP1(EXIF) segment; ARW/TIFF: IFD0 at header offset 4.
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let pos = 2;
    while (pos < buf.length - 4) {
      if (buf[pos] !== 0xff) break;
      const marker = buf[pos + 1];
      const size = buf.readUInt16BE(pos + 2);
      if (marker === 0xe1 && buf.toString('ascii', pos + 4, pos + 8) === 'Exif') {
        base = pos + 10;
        break;
      }
      pos += 2 + size;
    }
    if (base === 0) return { file, error: 'no EXIF segment' };
  }

  le = buf.toString('ascii', base, base + 2) === 'II';
  const ifd0 = readIFD(base + u32(base + 4));
  const pick = (t) => (ifd0[t] ? ifd0[t].value : null);
  const exif = pick(0x8769) ? readIFD(base + pick(0x8769)) : {};
  const gps = pick(0x8825) ? readIFD(base + pick(0x8825)) : {};
  const g = (t) => (gps[t] ? gps[t].value : null);

  const toDec = (arr, ref) =>
    Array.isArray(arr) ? (arr[0] + arr[1] / 60 + arr[2] / 3600) * (ref === 'S' || ref === 'W' ? -1 : 1) : null;

  const dateRaw = exif[0x9003] ? exif[0x9003].value : pick(0x0132);
  return {
    file: path.basename(file),
    date: dateRaw ? String(dateRaw).replace(/(\d{4}):(\d{2}):(\d{2}).*/, '$1-$2-$3') : null,
    dateTimeOriginal: dateRaw || null,
    make: pick(0x010f),
    model: pick(0x0110),
    lens: exif[0xa434] ? exif[0xa434].value : null,
    coords:
      g(2) && g(4) ? [Number(toDec(g(4), g(3)).toFixed(6)), Number(toDec(g(2), g(1)).toFixed(6))] : null,
  };
}

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('Usage: node scripts/extract-exif.js <image> [more images...]');
  process.exit(1);
}
console.log(JSON.stringify(files.map(extract), null, 2));
