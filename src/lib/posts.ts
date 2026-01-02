import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import rehypePrismPlus from 'rehype-prism-plus';
import { Post, VALID_CATEGORIES } from '@/types/post';

const postsDirectory = path.join(process.cwd(), 'content/articles');

/**
 * Calculate reading time for content (Chinese reading speed)
 * Assumes ~200 characters per minute for Chinese content
 */
export function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Convert relative image paths to absolute paths for static export
 * Relative paths like "img/xxx.jpg" become "/articles/img/xxx.jpg"
 * Also supports per-article images in content/articles/{slug}/img/
 */
function fixImagePathForCover(imagePath: string, slug: string): string {
  // If already absolute path or external URL, return as is
  if (imagePath.startsWith('/') || imagePath.startsWith('http')) {
    return imagePath;
  }

  // Get the filename from the path
  const filename = path.basename(imagePath);

  // Check if the image exists in the per-article img folder first
  const perArticleImgPath = path.join(postsDirectory, slug, 'img', filename);
  if (fs.existsSync(perArticleImgPath)) {
    return `/articles/${slug}/img/${filename}`;
  }

  // Otherwise use the shared img folder
  return `/articles/img/${filename}`;
}

/**
 * Convert relative image paths to absolute paths for static export
 * Relative paths like "img/xxx.jpg" become "/articles/{slug}/img/xxx.jpg"
 * Also supports per-article images in content/articles/{slug}/img/
 */
function fixImagePaths(content: string, slug: string): string {
  // Check for per-article img folder
  const perArticleImgDir = path.join(postsDirectory, slug, 'img');

  // Fix markdown image syntax: ![alt](img/xxx.jpg) -> ![alt](/articles/.../xxx.jpg)
  let fixed = content.replace(/!\[([^\]]*)\]\((img\/[^)]+)\)/g, (match, alt, imgPath) => {
    const filename = path.basename(imgPath);

    // Check if image exists in per-article folder
    const usePerArticle = fs.existsSync(path.join(perArticleImgDir, filename));
    const prefix = usePerArticle ? `${slug}/img` : 'img';

    return `![${alt}](/articles/${prefix}/${filename})`;
  });

  // Fix HTML img tag with relative paths (double quotes)
  fixed = fixed.replace(/<img\s+([^>]*)src="(img\/[^"]+)"([^>]*)>/gi, (match, before, imgPath, after) => {
    const filename = path.basename(imgPath);
    const usePerArticle = fs.existsSync(path.join(perArticleImgDir, filename));
    const prefix = usePerArticle ? `${slug}/img` : 'img';

    return `<img ${before}src="/articles/${prefix}/${filename}"${after}>`;
  });

  // Fix HTML img tag with relative paths (single quotes)
  fixed = fixed.replace(/<img\s+([^>]*)src='(img\/[^']+)'([^>]*)>/gi, (match, before, imgPath, after) => {
    const filename = path.basename(imgPath);
    const usePerArticle = fs.existsSync(path.join(perArticleImgDir, filename));
    const prefix = usePerArticle ? `${slug}/img` : 'img';

    return `<img ${before}src="/articles/${prefix}/${filename}"${after}>`;
  });

  return fixed;
}

/**
 * Extract the first image URL from markdown content
 * Matches both markdown syntax ![alt](url) and HTML <img> tags
 */
export function extractFirstImage(content: string): string | null {
  // Match markdown image syntax: ![alt](url)
  const markdownImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/;
  const markdownMatch = content.match(markdownImageRegex);

  if (markdownMatch) {
    return markdownMatch[2];
  }

  // Match HTML img tag: <img src="url" alt="alt">
  const htmlImageRegex = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/i;
  const htmlMatch = content.match(htmlImageRegex);

  if (htmlMatch) {
    return htmlMatch[1];
  }

  return null;
}

/**
 * Remove the first image from markdown content to avoid duplication
 */
export function removeFirstImage(content: string): string {
  // Remove only the first img tag (not all images)
  let cleaned = content.replace(/<img\s+[^>]*src=["']([^"']+)["'][^>]*>/i, '');

  return cleaned.trim();
}

/**
 * Extract cover image from markdown content (synchronous version)
 */
function extractCoverImageSync(content: string, slug: string): string | undefined {
  // Match markdown image syntax: ![alt](url)
  const markdownImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/;
  const markdownMatch = content.match(markdownImageRegex);

  let imagePath = null;
  if (markdownMatch) {
    imagePath = markdownMatch[2];
  } else {
    // Match HTML img tag
    const htmlImageRegex = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/i;
    const htmlMatch = content.match(htmlImageRegex);
    if (htmlMatch) {
      imagePath = htmlMatch[1];
    }
  }

  if (!imagePath) return undefined;

  // If already absolute path or external URL, return as is
  if (imagePath.startsWith('/') || imagePath.startsWith('http')) {
    return imagePath;
  }

  // Get the filename from the path
  const filename = path.basename(imagePath);

  // Check if the image exists in the per-article img folder first
  const perArticleImgPath = path.join(postsDirectory, slug, 'img', filename);
  if (fs.existsSync(perArticleImgPath)) {
    return `/articles/${slug}/img/${filename}`;
  }

  // Otherwise use the shared img folder
  return `/articles/img/${filename}`;
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      // Extract cover image from content
      const coverImage = extractCoverImageSync(content, slug);

      // Parse category from frontmatter (string or array)
      let category: Post['category'];
      if (typeof data.category === 'string') {
        category = data.category as Post['category'];
      } else if (Array.isArray(data.category) && data.category.length > 0) {
        // If array, take first element
        category = data.category[0] as Post['category'];
      }

      // Ensure required fields with defaults
      const post: Post = {
        slug,
        title: data.title || 'Untitled',
        date: data.date || new Date().toISOString().split('T')[0],
        description: data.description || '',
        author: data.author || 'Anonymous',
        tags: Array.isArray(data.tags) ? data.tags : [],
        category,
        coverImage,
      };

      return post;
    });

  // Sort posts by date in descending order
  return allPostsData.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Fix relative image paths before processing
    const contentWithFixedPaths = fixImagePaths(content, slug);

    // Process markdown content
    const processedContent = await remark()
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypePrismPlus, {
        ignoreMissing: true,
        showLineNumbers: true,
      })
      .use(rehypeStringify, { allowDangerousHtml: true })
      .process(contentWithFixedPaths);

    const contentHtml = processedContent.toString();

    // Extract first image as cover image
    const coverImageRaw = extractFirstImage(content);
    // Convert relative path to absolute path for cover image
    const coverImage = coverImageRaw ? fixImagePathForCover(coverImageRaw, slug) : undefined;

    // Remove first image from content to avoid duplication
    const contentWithoutFirstImage = removeFirstImage(contentHtml);

    // Create excerpt from content if not provided in frontmatter
    const excerpt = data.excerpt ||
      content
        .replace(/^#\s+.+$/gm, '') // Remove headers
        .replace(/\n\n/g, ' ') // Replace double newlines with space
        .trim()
        .substring(0, 200) + '...';

    const post: Post = {
      slug,
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString().split('T')[0],
      description: data.description || '',
      author: data.author || 'Anonymous',
      tags: Array.isArray(data.tags) ? data.tags : [],
      content: contentWithoutFirstImage,
      excerpt,
      coverImage,
      readingTime: getReadingTime(content),
    };

    return post;
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

export function getLatestPosts(count: number = 5): Post[] {
  const allPosts = getAllPosts();
  return allPosts.slice(0, count);
}

export function getPostsByTag(tag: string): Post[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) =>
    post.tags.some((postTag) =>
      postTag.toLowerCase() === tag.toLowerCase()
    )
  );
}

export function getAllTags(): string[] {
  const allPosts = getAllPosts();
  const tags = new Set<string>();

  allPosts.forEach((post) => {
    post.tags.forEach((tag) => {
      tags.add(tag);
    });
  });

  return Array.from(tags).sort();
}

/**
 * Get all categories (fixed list)
 */
export function getAllCategories(): string[] {
  return [...VALID_CATEGORIES];
}

/**
 * Filter posts by category
 */
export function getPostsByCategory(category?: string): Post[] {
  const allPosts = getAllPosts();

  if (!category) return allPosts;

  return allPosts.filter((post) => post.category === category);
}

