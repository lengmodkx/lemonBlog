/**
 * 上传本地照片到 RustFS（S3 兼容协议）。
 *
 * 用法:
 *   node scripts/upload-to-rustfs.js <本地文件或目录> [--prefix travel/2025-04-hangzhou] [--out manifest.json]
 *
 * 配置（写在 .env.local）:
 *   RUSTFS_ENDPOINT           例如 http://192.168.1.10:9000 （不带 bucket）
 *   RUSTFS_BUCKET             bucket 名
 *   RUSTFS_ACCESS_KEY_ID      AccessKey
 *   RUSTFS_SECRET_ACCESS_KEY  SecretKey
 *   RUSTFS_PREFIX             可选，对象路径前缀，如 blog/travel/
 *   RUSTFS_PUBLIC_URL         可选，对外访问地址（CDN/反代），缺省用 endpoint/bucket
 *
 * 上传后打印每个对象的 URL，复制到 content/travel/photos.json 的 src 即可。
 */
require('dotenv').config({ path: '.env.local' });

const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

const CONTENT_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
};

function usage() {
  console.log('Usage: node scripts/upload-to-rustfs.js <file-or-dir> [--prefix travel/xxx] [--out manifest.json]');
  process.exit(1);
}

function parseArgs(argv) {
  const args = { target: null, prefix: null, out: null };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--prefix') args.prefix = argv[++i];
    else if (arg === '--out') args.out = argv[++i];
    else if (!args.target) args.target = arg;
  }
  return args;
}

function collectFiles(target) {
  const stat = fs.statSync(target);
  if (stat.isFile()) return [target];
  return fs
    .readdirSync(target)
    .map((name) => path.join(target, name))
    .filter((p) => fs.statSync(p).isFile() && IMAGE_EXTS.has(path.extname(p).toLowerCase()))
    .sort();
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing env ${name} in .env.local`);
    process.exit(1);
  }
  return value;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.target) usage();
  if (!fs.existsSync(args.target)) {
    console.error(`Not found: ${args.target}`);
    process.exit(1);
  }

  const endpoint = requireEnv('RUSTFS_ENDPOINT').replace(/\/$/, '');
  const bucket = requireEnv('RUSTFS_BUCKET');
  const accessKeyId = requireEnv('RUSTFS_ACCESS_KEY_ID');
  const secretAccessKey = requireEnv('RUSTFS_SECRET_ACCESS_KEY');
  const envPrefix = (process.env.RUSTFS_PREFIX || '').replace(/^\/+|\/+$/g, '');
  const publicUrl = (process.env.RUSTFS_PUBLIC_URL || `${endpoint}/${bucket}`).replace(/\/$/, '');

  const prefix = [envPrefix, args.prefix].filter(Boolean).join('/').replace(/^\/+|\/+$/g, '');

  const client = new S3Client({
    endpoint: `${endpoint}`,
    region: process.env.RUSTFS_REGION || 'us-east-1',
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true, // RustFS / MinIO 风格路径寻址
  });

  const files = collectFiles(args.target);
  if (files.length === 0) {
    console.error('No image files found.');
    process.exit(1);
  }

  console.log(`Uploading ${files.length} file(s) to s3://${bucket}/${prefix ? prefix + '/' : ''} ...`);

  const manifest = [];
  for (const file of files) {
    const key = [prefix, path.basename(file)].filter(Boolean).join('/');
    const ext = path.extname(file).toLowerCase();
    const body = fs.readFileSync(file);

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: CONTENT_TYPES[ext] || 'application/octet-stream',
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    );

    const url = `${publicUrl}/${key}`;
    manifest.push({ file: path.basename(file), key, url, bytes: body.length });
    console.log(`  ok  ${key}  (${(body.length / 1024).toFixed(0)} KB)`);
    console.log(`      ${url}`);
  }

  if (args.out) {
    fs.writeFileSync(args.out, JSON.stringify(manifest, null, 2), 'utf8');
    console.log(`Manifest written: ${args.out}`);
  }
  console.log('Done.');
}

main().catch((err) => {
  console.error('Upload failed:', err.message);
  process.exit(1);
});
