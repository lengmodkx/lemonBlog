const fs = require('fs');
const matter = require('gray-matter');

const filePath = 'D:\\lemonArticle\\my-article\\博客文章\\kk聊房价.md';
const content = fs.readFileSync(filePath, 'utf8');

// Split frontmatter and content
const { data, content: markdownContent } = matter(content);

// Function to generate slug from text (similar to how rehype generates IDs)
function generateSlug(text) {
  // Strip number prefix like "1.1 ", "1.1.1 ", "1、", "2、" etc.
  const textWithoutPrefix = text.replace(/^[\d.]+\s+|^[\d]+[、.]\s*/, '');

  return textWithoutPrefix
    .toLowerCase()
    .replace(/[^\u4e00-\u9fa5a-z0-9\s-]/g, '') // Keep only Chinese, alphanumeric, spaces, hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Pattern to match headings
const headingPattern = /^(#{1,6})\s+(.+?)(?:\s+\{#([^}]+)\})?\s*$/gm;

// Map to store title -> ID mapping for TOC updates
const titleToId = new Map();

let fixedContent = markdownContent;
const seenIds = new Set();

// Process headings - add/update custom IDs
fixedContent = fixedContent.replace(headingPattern, (match, level, title, existingId) => {
  // Generate ID from title (strip number prefix for TOC compatibility)
  let id = generateSlug(title);

  // Handle duplicates
  let finalId = id;
  let counter = 1;
  while (seenIds.has(finalId)) {
    finalId = `${id}-${counter}`;
    counter++;
  }
  seenIds.add(finalId);

  // Store title -> ID mapping for TOC updates (strip number prefix for matching)
  const titleWithoutPrefix = title.replace(/^[\d.]+\s+|^[\d]+[、.]\s*/, '');
  titleToId.set(titleWithoutPrefix, finalId);

  // Return heading with custom ID (always regenerate to match TOC)
  return `${level} ${title} {#${finalId}}`;
});

// Update TOC links to match generated IDs
fixedContent = fixedContent.replace(/\[([^\]]+)\]\((#[^)]+)\)/g, (match, linkText, anchor) => {
  // Strip number prefix from link text to match with stored titles
  const linkTextWithoutPrefix = linkText.replace(/^[\d.]+\s+|^[\d]+[、.]\s*/, '');
  // Check if we have a matching ID for this title
  if (titleToId.has(linkTextWithoutPrefix)) {
    const id = titleToId.get(linkTextWithoutPrefix);
    return `[${linkText}](#${id})`;
  }
  return match;
});

// Update frontmatter if needed
if (!data.updated) {
  data.updated = new Date().toISOString().split('T')[0];
}

const newContent = matter.stringify(fixedContent, data);

// Write back
fs.writeFileSync(filePath, newContent, 'utf8');

console.log('✅ Fixed anchor links in kk聊房价.md');
console.log(`   Processed ${seenIds.size} headings`);
