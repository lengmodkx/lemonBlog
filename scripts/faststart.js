/**
 * MP4 faststart：把 moov 元数据从文件尾部移到头部，浏览器/播放器无需下载完整文件即可播放。
 *
 * 背景：DJI 等设备导出的 mp4 常见布局为 ftyp → mdat → moov（moov 在尾部），
 * HTML5 <video> 为拿到时长/索引必须下载整个文件。本脚本重排为 ftyp → moov → mdat，
 * 并修正 moov 中 stco/co64 的 chunk 偏移量。
 *
 * 用法:
 *   node scripts/faststart.js <in.mp4> [more.mp4 ...]        # 输出 <name>.fs.mp4
 *   node scripts/faststart.js --dir <目录>                    # 批量处理目录内 mp4
 *
 * 验证：输出文件与输入大小一致，且所有 chunk offset 均落在 mdat 区间内。
 */
const fs = require('fs');
const path = require('path');

function readBoxes(buf, start, end) {
  const boxes = [];
  let pos = start;
  while (pos + 8 <= end) {
    let size = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    let headerSize = 8;
    if (size === 1) {
      size = Number(buf.readBigUInt64BE(pos + 8));
      headerSize = 16;
    } else if (size === 0) {
      size = end - pos;
    }
    if (size < headerSize) break;
    boxes.push({ type, start: pos, size, headerSize, end: pos + size });
    pos += size;
  }
  return boxes;
}

/** 递归找出 moov 内所有 stco / co64 box 的数据区偏移与数量 */
function findChunkOffsetBoxes(buf, start, end, out = []) {
  for (const box of readBoxes(buf, start, end)) {
    if (box.type === 'stco' || box.type === 'co64') {
      const count = buf.readUInt32BE(box.start + box.headerSize + 4);
      out.push({ type: box.type, dataStart: box.start + box.headerSize + 8, count });
    } else if (['moov', 'trak', 'mdia', 'minf', 'stbl', 'edts', 'udta'].includes(box.type)) {
      findChunkOffsetBoxes(buf, box.start + box.headerSize, box.end, out);
    }
  }
  return out;
}

function faststart(file) {
  const buf = fs.readFileSync(file);
  const topBoxes = readBoxes(buf, 0, buf.length);
  const ftyp = topBoxes.find((b) => b.type === 'ftyp');
  const moov = topBoxes.find((b) => b.type === 'moov');
  const mdat = topBoxes.find((b) => b.type === 'mdat');

  if (!ftyp || !moov || !mdat) {
    return { file, skipped: true, reason: 'missing ftyp/moov/mdat' };
  }
  if (moov.start < mdat.start) {
    return { file, skipped: true, reason: 'already faststart' };
  }

  // 新布局：ftyp + moov + 其余 box（保持原有顺序）
  const moovBuf = Buffer.from(buf.subarray(moov.start, moov.end));
  const rest = topBoxes.filter((b) => b !== moov && b !== ftyp);
  const newMdatStart = ftyp.size + moov.size + rest.filter((b) => b.start < mdat.start).reduce((s, b) => s + b.size, 0);
  const delta = newMdatStart - mdat.start;

  // 修正 moov 副本内的 chunk 偏移
  const offsetBoxes = findChunkOffsetBoxes(moovBuf, 0, moovBuf.length);
  for (const ob of offsetBoxes) {
    for (let i = 0; i < ob.count; i++) {
      const at = ob.dataStart + i * (ob.type === 'stco' ? 4 : 8);
      if (ob.type === 'stco') {
        moovBuf.writeUInt32BE(moovBuf.readUInt32BE(at) + delta, at);
      } else {
        moovBuf.writeBigUInt64BE(moovBuf.readBigUInt64BE(at) + BigInt(delta), at);
      }
    }
  }

  // 写出
  const out = file.replace(/\.mp4$/i, '') + '.fs.mp4';
  const fd = fs.openSync(out, 'w');
  fs.writeSync(fd, buf, ftyp.start, ftyp.size, 0);
  fs.writeSync(fd, moovBuf, 0, moovBuf.length, ftyp.size);
  let cursor = ftyp.size + moovBuf.length;
  for (const b of rest) {
    fs.writeSync(fd, buf, b.start, b.size, cursor);
    cursor += b.size;
  }
  fs.closeSync(fd);

  // 校验：大小一致 + chunk offsets 落在新 mdat 区间
  const outBuf = fs.readFileSync(out);
  const outBoxes = readBoxes(outBuf, 0, outBuf.length);
  const newMdat = outBoxes.find((b) => b.type === 'mdat');
  const newMoov = outBoxes.find((b) => b.type === 'moov');
  let bad = 0;
  for (const ob of findChunkOffsetBoxes(outBuf, newMoov.start, newMoov.end)) {
    for (let i = 0; i < ob.count; i++) {
      const at = ob.dataStart + i * (ob.type === 'stco' ? 4 : 8);
      const off = ob.type === 'stco' ? outBuf.readUInt32BE(at) : Number(outBuf.readBigUInt64BE(at));
      if (off < newMdat.start || off >= newMdat.end) bad++;
    }
  }
  const ok = outBuf.length === buf.length && bad === 0 && newMoov.start < newMdat.start;
  return {
    file: path.basename(file),
    out: path.basename(out),
    mb: Number((buf.length / 1024 / 1024).toFixed(1)),
    chunkBoxes: offsetBoxes.length,
    badOffsets: bad,
    ok,
  };
}

const args = process.argv.slice(2);
let files = [];
if (args[0] === '--dir') {
  files = fs.readdirSync(args[1]).filter((f) => f.toLowerCase().endsWith('.mp4') && !f.endsWith('.fs.mp4')).map((f) => path.join(args[1], f));
} else {
  files = args;
}
if (files.length === 0) {
  console.error('Usage: node scripts/faststart.js <file.mp4 ...> | --dir <dir>');
  process.exit(1);
}

for (const f of files) {
  console.log(JSON.stringify(faststart(f)));
}
