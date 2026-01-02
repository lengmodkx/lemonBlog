import OSS from 'ali-oss';
import fs from 'fs';
import path from 'path';

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
export async function uploadToOSS(
  localPath: string,
  ossPath: string
): Promise<string> {
  try {
    const result = await client.put(ossPath, localPath);
    return result.url;
  } catch (error) {
    console.error(`上传失败: ${localPath}`, error);
    throw error;
  }
}

/**
 * 批量上传目录中的图片到OSS
 */
export async function uploadImageDirToOSS(
  localDir: string,
  ossBasePath: string
): Promise<Map<string, string>> {
  const urlMap = new Map<string, string>();

  if (!fs.existsSync(localDir)) {
    console.log(`目录不存在: ${localDir}`);
    return urlMap;
  }

  const files = fs.readdirSync(localDir);
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (imageExtensions.includes(ext)) {
      const localPath = path.join(localDir, file);
      const ossPath = `${ossBasePath}${file}`;

      try {
        const url = await uploadToOSS(localPath, ossPath);
        urlMap.set(file, url);
        console.log(`✓ 已上传: ${file} -> ${url}`);
      } catch (error) {
        console.error(`✗ 上传失败: ${file}`);
      }
    }
  }

  return urlMap;
}

/**
 * 从markdown内容中提取图片URL并上传
 */
export async function extractAndUploadImages(
  content: string,
  imageDir: string,
  ossBasePath: string
): Promise<{ content: string; urlMap: Map<string, string> }> {
  const urlMap = new Map<string, string>();
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
      } catch (error) {
        console.error(`上传失败: ${fileName}`);
      }
    }
  }

  return { content: updatedContent, urlMap };
}
