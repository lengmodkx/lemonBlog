/**
 * 图片 URL 加版本参数，绕过浏览器/CDN 对旧响应的 immutable 缓存。
 * 照片内容更新时 bump 这个版本号即可让所有访客拿到新图。
 */
export const PHOTO_CACHE_VERSION = 'v=20261011';

export function photoUrl(url: string): string {
  if (!url) return url;
  return `${url}${url.includes('?') ? '&' : '?'}${PHOTO_CACHE_VERSION}`;
}
