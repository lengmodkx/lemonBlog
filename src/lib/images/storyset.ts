// Storyset 集成
// 获取精美的插画作品

interface StorysetIllustration {
  id: string;
  title: string;
  url: string;
  downloadUrl: string;
  category: string;
  tags: string[];
  animated: boolean;
  colorMode: 'light' | 'dark' | 'colored';
  data: string; // SVG数据
}

interface StorysetConfig {
  baseUrl: string;
  categories: string[];
}

class StorysetService {
  private config: StorysetConfig;
  private cachedIllustrations: Map<string, StorysetIllustration[]> = new Map();

  constructor() {
    this.config = {
      baseUrl: 'https://storyset.com',
      categories: [
        'web', 'mobile', 'data', 'security', 'business',
        'education', 'health', 'lifestyle', 'technology'
      ]
    };
  }

  /**
   * 根据关键词获取插画URL
   * Storyset主要通过URL参数来定制插画
   */
  getIllustrationUrl(
    illustrationId: string,
    options: {
      color?: string;
      mode?: 'light' | 'dark' | 'colored';
      animated?: boolean;
    } = {}
  ): string {
    const { color = '#0D47A1', mode = 'colored', animated = false } = options;

    // 构建Storyset URL
    const baseUrl = `https://storyset.com/illustration/${illustrationId}`;
    const params = new URLSearchParams({
      color: color.replace('#', ''), // 移除#号
      mode
    });

    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * 获取常用的插画ID列表
   */
  getIllustrationIds(): { [key: string]: string[] } {
    return {
      'web': ['web-setup', 'programming', 'web-design', 'responsive', 'dashboard'],
      'development': ['coding', 'pair-programming', 'code-review', 'debugging', 'testing'],
      'data': ['data-analytics', 'database', 'big-data', 'cloud-storage', 'api'],
      'security': ['cybersecurity', 'firewall', 'encryption', 'authentication', 'privacy'],
      'team': ['teamwork', 'collaboration', 'meeting', 'presentation', 'communication'],
      'education': ['learning', 'tutorial', 'online-education', 'certification', 'study'],
      'business': ['startup', 'innovation', 'strategy', 'growth', 'success'],
      'mobile': ['app-development', 'responsive-design', 'mobile-app', 'user-interface'],
      'performance': ['optimization', 'speed', 'loading', 'efficiency', 'analysis'],
      'error': ['404-error', 'bug', 'system-failure', 'maintenance', 'warning'],
      'success': ['success', 'completion', 'achievement', 'goal', 'celebration']
    };
  }

  /**
   * 根据文章标签推荐插画
   */
  getIllustrationForTags(
    tags: string[],
    options: {
      color?: string;
      mode?: 'light' | 'dark' | 'colored';
      animated?: boolean;
    } = {}
  ): StorysetIllustration | null {
    const illustrationIds = this.getIllustrationIds();
    const { color = '#0D47A1', mode = 'colored', animated = false } = options;

    // 匹配标签到插画类别
    for (const tag of tags) {
      const tagLower = tag.toLowerCase();

      for (const [category, ids] of Object.entries(illustrationIds)) {
        if (tagLower.includes(category) || category.includes(tagLower)) {
          const randomId = ids[Math.floor(Math.random() * ids.length)];
          return this.createIllustration(randomId, tag, category, options);
        }
      }
    }

    // 如果没有匹配，返回默认插画
    const defaultIds = illustrationIds['web'];
    const randomId = defaultIds[Math.floor(Math.random() * defaultIds.length)];
    return this.createIllustration(randomId, 'default', 'web', options);
  }

  /**
   * 创建插画对象
   */
  private createIllustration(
    id: string,
    title: string,
    category: string,
    options: {
      color?: string;
      mode?: 'light' | 'dark' | 'colored';
      animated?: boolean;
    } = {}
  ): StorysetIllustration {
    const { color = '#0D47A1', mode = 'colored', animated = false } = options;

    return {
      id,
      title: `${title} illustration`,
      url: this.getIllustrationUrl(id, { color, mode, animated }),
      downloadUrl: `https://api.storyset.com/v1/illustration/${id}/download?color=${color.replace('#', '')}&mode=${mode}`,
      category,
      tags: [title, category],
      animated,
      colorMode: mode,
      data: '' // SVG数据需要异步获取
    };
  }

  /**
   * 获取插画的SVG代码
   * 注意：这通常需要在服务端处理，因为Storyset的SVG需要API调用
   */
  async getSvgData(
    illustrationId: string,
    options: {
      color?: string;
      mode?: 'light' | 'dark' | 'colored';
    } = {}
  ): Promise<string> {
    try {
      const { color = '#0D47A1', mode = 'colored' } = options;
      const url = `https://api.storyset.com/v1/illustration/${illustrationId}/svg?color=${color.replace('#', '')}&mode=${mode}`;

      // 这里需要设置正确的API密钥
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${process.env.STORYSET_API_KEY || 'demo'}`
        }
      });

      if (response.ok) {
        return await response.text();
      }
    } catch (error) {
      console.error('Storyset SVG fetch error:', error);
    }

    // 返回占位SVG
    return this.getPlaceholderSvg(illustrationId, options.color);
  }

  /**
   * 获取占位SVG
   */
  private getPlaceholderSvg(illustrationId: string, color: string = '#0D47A1'): string {
    return `
      <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#f5f5f5"/>
        <rect x="100" y="75" width="200" height="150" fill="${color}" rx="10" opacity="0.1"/>
        <circle cx="200" cy="150" r="40" fill="${color}" opacity="0.3"/>
        <text x="200" y="250" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="14">
          ${illustrationId.replace('-', ' ').toUpperCase()}
        </text>
        <text x="200" y="280" text-anchor="middle" fill="#999" font-family="Arial, sans-serif" font-size="12">
          Storyset Illustration
        </text>
      </svg>
    `;
  }

  /**
   * 批量获取文章相关插画
   */
  async getIllustrationsForArticles(
    articles: Array<{ slug: string; tags: string[]; title: string }>
  ): Promise<Array<{ slug: string; illustration: StorysetIllustration | null }>> {
    const results = [];

    for (const article of articles) {
      const illustration = this.getIllustrationForTags(article.tags);
      results.push({
        slug: article.slug,
        illustration
      });
    }

    return results;
  }

  /**
   * 获取插画分类列表
   */
  getCategories(): Array<{ name: string; description: string; count: number }> {
    const illustrationIds = this.getIllustrationIds();

    return Object.entries(illustrationIds).map(([name, ids]) => ({
      name,
      description: `${name} related illustrations`,
      count: ids.length
    }));
  }

  /**
   * 生成插画的嵌入代码
   */
  generateEmbedCode(
    illustration: StorysetIllustration,
    width: number = 400,
    height: number = 300
  ): string {
    return `
      <div class="storyset-illustration" style="width: ${width}px; height: ${height}px;">
        <img
          src="${illustration.url}"
          alt="${illustration.title}"
          style="width: 100%; height: 100%; object-fit: contain;"
          loading="lazy"
        />
        <p class="text-xs text-gray-500 mt-2 text-center">
          Illustration by <a href="https://storyset.com" target="_blank" rel="noopener noreferrer">Storyset</a>
        </p>
      </div>
    `;
  }
}

export const storysetService = new StorysetService();
export type { StorysetIllustration };