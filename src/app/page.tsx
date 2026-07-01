import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, EnvelopeSimple } from '@phosphor-icons/react/dist/ssr';
import { getAllPosts, getLatestPosts } from '@/lib/posts';
import { getGitHubProjects } from '@/lib/github';
import ArticleCard from '@/components/ArticleCard';
import ProjectCard from '@/components/projects/ProjectCard';

export const metadata = {
  title: 'Lemon Blog',
  description: 'Personal blog about web development, programming, and technology.',
};

export const revalidate = 3600;

const techStack = [
  'Java',
  'Spring Boot',
  'Spring Cloud',
  'MySQL',
  'Redis',
  'Docker',
  'RabbitMQ',
];

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
        {value}
      </span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

export default async function Home() {
  const allPosts = getAllPosts();
  const latestPosts = getLatestPosts(4);
  const projects = await getGitHubProjects();
  const featuredProjects = projects.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground mb-4">你好，我是</p>

            <h1 className="text-4xl md:text-6xl font-semibold text-foreground tracking-tight mb-6">
              lemon
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-8">
              一名 Java 后端开发者，喜欢编程、阅读和分享知识。这个博客用于记录我的学习、思考，以及折腾过的一些项目。
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
              >
                浏览文章
                <ArrowRight size={16} weight="bold" />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
              >
                查看项目
                <ArrowRight size={16} weight="bold" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center px-5 py-2.5 border border-border text-foreground rounded-lg font-medium hover:bg-muted/50 transition-colors"
              >
                关于我
              </Link>
            </div>
          </div>

          <div className="shrink-0">
            <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden ring-1 ring-border bg-muted">
              <Image
                src="/images/avatar.jpg"
                alt="lemon"
                fill
                sizes="144px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats + Tech */}
      <section className="border-y border-border bg-card">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
            <div className="flex gap-8 md:gap-12">
              <StatItem value={String(allPosts.length)} label="文章" />
              <StatItem value={String(projects.length)} label="项目" />
            </div>

            <div className="hidden md:block h-10 w-px bg-border" />

            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-sm rounded-full bg-background text-muted-foreground border border-border"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest posts */}
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight">
            最新文章
          </h2>
          <Link
            href="/blog"
            className="text-sm text-muted-foreground hover:text-accent transition-colors inline-flex items-center gap-1"
          >
            全部文章
            <ArrowRight size={14} weight="bold" />
          </Link>
        </div>

        {latestPosts.length > 0 ? (
          <div className="bg-card rounded-xl border border-border px-6">
            {latestPosts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-xl border border-border">
            <p className="text-muted-foreground">暂无文章</p>
          </div>
        )}
      </section>

      {/* Featured projects */}
      {featuredProjects.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 pb-16 md:pb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-foreground tracking-tight">
              最近项目
            </h2>
            <Link
              href="/projects"
              className="text-sm text-muted-foreground hover:text-accent transition-colors inline-flex items-center gap-1"
            >
              全部项目
              <ArrowRight size={14} weight="bold" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-16 md:pb-24">
        <div className="rounded-2xl bg-muted border border-border p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-2">
                一起聊聊？
              </h2>
              <p className="text-muted-foreground max-w-md">
                如果你对我的文章或项目感兴趣，欢迎通过邮件联系我。
              </p>
            </div>
            <a
              href="mailto:lengmodkx@gmail.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors shrink-0"
            >
              <EnvelopeSimple size={18} weight="bold" />
              发送邮件
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
