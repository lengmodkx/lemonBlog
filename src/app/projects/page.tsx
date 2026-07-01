import Link from 'next/link';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr';
import { getGitHubProjects } from '@/lib/github';
import ProjectCard from '@/components/projects/ProjectCard';

export const metadata = {
  title: '项目 | Lemon Blog',
  description: '我的开源项目与代码实验',
};

export const revalidate = 3600;

export default async function ProjectsPage() {
  const projects = await getGitHubProjects();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-10 transition-colors"
        >
          <ArrowLeft size={14} weight="bold" />
          返回首页
        </Link>

        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight mb-3">
            项目
          </h1>
          <p className="text-muted-foreground max-w-xl leading-relaxed">
            这里是我的一些开源项目和代码实验，主要围绕后端开发、工具脚本和可视化应用。
          </p>
        </header>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-xl border border-border">
            <p className="text-muted-foreground">暂时无法加载项目列表</p>
          </div>
        )}
      </div>
    </div>
  );
}
