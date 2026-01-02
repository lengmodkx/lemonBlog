const OSS = require('ali-oss');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// 初始化OSS客户端
const client = new OSS({
  region: process.env.OSS_REGION || '',
  accessKeyId: process.env.OSS_ACCESS_KEY_ID || '',
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET || '',
  bucket: process.env.OSS_BUCKET || '',
});

/**
 * 上传单个文件到OSS
 */
async function uploadToOSS(localPath, ossPath) {
  try {
    const result = await client.put(ossPath, localPath);
    return result.url;
  } catch (error) {
    console.error(`上传失败: ${localPath}`, error);
    throw error;
  }
}

/**
 * 从markdown内容中提取图片URL并上传
 */
async function extractAndUploadImages(content, imageDir, ossBasePath) {
  const urlMap = new Map();
  let updatedContent = content;

  // 匹配markdown图片: ![alt](url)
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const matches = [...content.matchAll(imageRegex)];

  for (const match of matches) {
    const [fullMatch, alt, imageUrl] = match;

    // 跳过已经是URL的图片
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      continue;
    }

    const fileName = path.basename(imageUrl);
    const localPath = path.join(imageDir, fileName);

    if (fs.existsSync(localPath)) {
      const ossPath = `${ossBasePath}${fileName}`;

      try {
        const url = await uploadToOSS(localPath, ossPath);
        urlMap.set(fileName, url);

        // 替换为OSS URL
        updatedContent = updatedContent.replace(
          fullMatch,
          `![${alt}](${url})`
        );
        console.log(`✓ 已上传: ${fileName} -> ${url}`);
      } catch (error) {
        console.error(`✗ 上传失败: ${fileName}`);
      }
    }
  }

  return { content: updatedContent, urlMap };
}

async function main() {
  const articlePath = process.argv[2];
  const ossPrefix = process.argv[3] || 'blog/images/';

  if (!articlePath) {
    console.error('用法: node upload-to-oss.js <文章路径> [OSS前缀]');
    console.error('示例: node upload-to-oss.js "content/articles/2025-07-21-sony-a6700-guide.md" "blog/images/"');
    process.exit(1);
  }

  const articleFile = path.resolve(articlePath);

  if (!fs.existsSync(articleFile)) {
    console.error(`文件不存在: ${articleFile}`);
    process.exit(1);
  }

  const articleDir = path.dirname(articleFile);
  const slug = path.basename(articleFile, '.md');

  // 尝试多个可能的图片目录位置
  const possibleImgDirs = [
    path.join('public/articles', slug, 'img'),
    path.join('D:\\lemonArticle\\lemonBlog\\public\\articles', slug, 'img'),
    path.join(articleDir, 'img'),
  ];

  let imgDir = null;
  for (const dir of possibleImgDirs) {
    if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
      const files = fs.readdirSync(dir);
      const hasImages = files.some(f => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f));
      if (hasImages) {
        imgDir = dir;
        break;
      }
    }
  }

  if (!imgDir) {
    console.log('\n未找到图片目录，跳过上传');
    return;
  }

  console.log(`\n处理文章: ${slug}`);
  console.log(`图片目录: ${imgDir}`);
  console.log(`OSS前缀: ${ossPrefix}${slug}/\n`);

  // 读取文章内容
  const content = fs.readFileSync(articleFile, 'utf8');

  // 上传图片并替换链接
  try {
    const { content: updatedContent, urlMap } = await extractAndUploadImages(
      content,
      imgDir,
      `${ossPrefix}${slug}/`
    );

    // 写回更新后的内容
    fs.writeFileSync(articleFile, updatedContent);

    console.log(`\n✓ 上传完成! 共上传 ${urlMap.size} 张图片`);
    console.log(`✓ 文章已更新: ${articleFile}\n`);
  } catch (error) {
    console.error('\n✗ 上传失败:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);
