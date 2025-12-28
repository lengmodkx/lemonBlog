import Link from 'next/link';
import Image from 'next/image';
import { getLatestPosts } from '@/lib/posts';
import ArticleCard from '@/components/ArticleCard';

export const metadata = {
  title: 'Lemon Blog',
  description: 'Personal blog about web development, programming, and technology.',
};

const techStack = ['React', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind CSS'];
const socialLinks = [
  { name: 'GitHub', href: 'https://github.com' },
  { name: 'Twitter', href: 'https://twitter.com' },
  { name: 'Email', href: 'mailto:your@email.com' },
];

export default function Home() {
  const latestPosts = getLatestPosts(6);

  return (
    <div className="min-h-screen bg-paper-50 dark:bg-ink-DEFAULT">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-lavender-200/30 dark:bg-lavender-900/20 blur-[120px]" />
        <div className="absolute top-[30%] right-[-15%] w-[35%] h-[35%] rounded-full bg-purple-200/20 dark:bg-purple-900/20 blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[20%] w-[30%] h-[30%] rounded-full bg-pink-200/20 dark:bg-pink-900/20 blur-[80px]" />
      </div>

      {/* Hero Section */}
      <section className="relative max-w-2xl mx-auto px-4 py-20 text-center">
        {/* Avatar */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <Image
            src="/images/avatar.jpg"
            alt="Lemon"
            fill
            className="rounded-full object-cover shadow-lg"
          />
          <div className="absolute inset-0 rounded-full ring-4 ring-lavender-100 dark:ring-lavender-900/30" />
        </div>

        <h1 className="text-3xl font-bold text-ink dark:text-text-primary mb-3">
          Hello, World
        </h1>
        <p className="text-ink-light dark:text-text-secondary text-base max-w-md mx-auto mb-8">
          热爱编程，专注于 Web 开发与技术分享
        </p>

        {/* Tech Stack Tags */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-full bg-lavender-100 dark:bg-lavender-900/30 text-primary dark:text-lavender-400 text-sm"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-6 mb-8">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm text-text-muted hover:text-primary transition-colors"
              target={link.name === 'Email' ? undefined : '_blank'}
              rel={link.name === 'Email' ? undefined : 'noopener noreferrer'}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-6 text-sm">
          <Link href="/blog" className="text-text-muted hover:text-primary transition-colors">
            文章
          </Link>
          <Link href="/about" className="text-text-muted hover:text-primary transition-colors">
            关于
          </Link>
        </div>
      </section>

      {/* About Card */}
      <section className="max-w-2xl mx-auto px-4 pb-8">
        <div className="bg-card rounded-xl p-6 mb-8 shadow-sm border border-lavender-100 dark:border-lavender-800/50">
          <h3 className="font-semibold text-ink dark:text-text-primary mb-3">
            关于我
          </h3>
          <p className="text-sm text-text-secondary">
            全栈开发者，热衷于探索新技术，喜欢通过博客记录学习心得和项目实践。
            这里是分享知识、交流想法的地方，期待与你共同成长。
          </p>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="max-w-2xl mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold text-ink dark:text-text-primary">
            最新文章
          </h2>
          <Link
            href="/blog"
            className="text-sm text-primary hover:text-primary-hover transition-colors"
          >
            查看全部 →
          </Link>
        </div>

        {latestPosts.length > 0 ? (
          <div className="space-y-4">
            {latestPosts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-text-muted">暂无文章</p>
          </div>
        )}
      </section>
    </div>
  );
}
