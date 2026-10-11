/**
 * 上传视频（mp4）到 RustFS，按文件名时间戳排序并重命名。
 *
 * 用法:
 *   node scripts/upload-videos.js <目录> --prefix travel/2026-10-07/video --rename CKV [--out manifest.json]
 *
 * 重命名规则：按文件名中的 YYYY_MMDD_HHMMSS 时间戳排序后生成 CKV01.mp4、CKV02.mp4 ...
 * 不加 --rename 则保留原文件名。
 */
require('dotenv').config({ path: '.env.local' });

const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

function parseArgs(argv) {
  const args = { target: null, prefix: null, rename: null, out: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--prefix') args.prefix = argv[++i];
    else if (a === '--rename') args.rename = argv[++i];
    else if (a === '--out') args.out = argv[++i];
    else if (!args.target) args.target = a;
  }
  return args;
}

function requireEnv(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing env ${name} in .env.local`);
    process.exit(1);
  }
  return v;
}

function timestampOf(name) {
  const m = name.match(/(\d{8}_\d{6})/);
  return m ? m[1] : '00000000_000000';
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.target) {
    console.error('Usage: node scripts/upload-videos.js <dir> --prefix <key/prefix> [--rename <NAME>] [--out manifest.json]');
    process.exit(1);
  }

  const endpoint = requireEnv('RUSTFS_ENDPOINT').replace(/\/$/, '');
  const bucket = requireEnv('RUSTFS_BUCKET');
  const envPrefix = (process.env.RUSTFS_PREFIX || '').replace(/^\/+|\/+$/g, '');
  const publicUrl = (process.env.RUSTFS_PUBLIC_URL || `${endpoint}/${bucket}`).replace(/\/$/, '');
  const prefix = [envPrefix, args.prefix].filter(Boolean).join('/').replace(/^\/+|\/+$/g, '');

  const client = new S3Client({
    endpoint,
    region: process.env.RUSTFS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: requireEnv('RUSTFS_ACCESS_KEY_ID'),
      secretAccessKey: requireEnv('RUSTFS_SECRET_ACCESS_KEY'),
    },
    forcePathStyle: true,
  });

  const files = fs
    .readdirSync(args.target)
    .filter((f) => f.toLowerCase().endsWith('.mp4'))
    .sort((a, b) => timestampOf(a).localeCompare(timestampOf(b)));

  if (files.length === 0) {
    console.error('No .mp4 files found.');
    process.exit(1);
  }

  console.log(`Uploading ${files.length} video(s) to s3://${bucket}/${prefix}/ ...`);
  const manifest = [];
  let i = 0;
  for (const f of files) {
    i++;
    const name = args.rename
      ? `${args.rename}${String(i).padStart(2, '0')}.mp4`
      : f;
    const key = [prefix, name].filter(Boolean).join('/');
    const body = fs.readFileSync(path.join(args.target, f));
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: 'video/mp4',
        CacheControl: 'public, max-age=86400',
      }),
    );
    const url = `${publicUrl}/${key}`;
    manifest.push({ name, source: f, url, mb: Number((body.length / 1024 / 1024).toFixed(1)) });
    console.log(`  ok  ${key}  (${(body.length / 1024 / 1024).toFixed(1)} MB)`);
    console.log(`      ${url}`);
  }

  if (args.out) {
    fs.writeFileSync(args.out, JSON.stringify(manifest, null, 2), 'utf8');
    console.log(`Manifest written: ${args.out}`);
  }
  console.log('Done.');
}

main().catch((e) => {
  console.error('Upload failed:', e.message);
  process.exit(1);
});
