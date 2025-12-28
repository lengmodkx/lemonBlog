const pinyin = require('pinyin');

const title = process.argv[2] || 'kk聊房价';
const created = process.argv[3] || '2025-09-11';

const pinyinResult = pinyin(title, {
  style: pinyin.STYLE_NORMAL,
  heteronym: false,
  segment: true
}).flat().join('-');

const clean = pinyinResult
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const filename = `${created}-${clean}.md`;
console.log(filename);
