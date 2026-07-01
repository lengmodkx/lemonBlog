import { GithubLogo, Star, GitFork } from '@phosphor-icons/react/dist/ssr';
import type { GitHubRepo } from '@/lib/github';

interface ProjectCardProps {
  project: GitHubRepo;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
  });
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <a
      href={project.htmlUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-5 rounded-xl border border-border bg-card hover:border-accent transition-colors"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <GithubLogo size={22} weight="fill" className="text-muted-foreground shrink-0" />
          <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors truncate">
            {project.name}
          </h3>
        </div>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 min-h-[2.5rem]">
        {project.description || '暂无描述'}
      </p>

      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        {project.language && (
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent" />
            {project.language}
          </span>
        )}

        <span className="inline-flex items-center gap-1">
          <Star size={14} weight="fill" />
          {project.stargazersCount}
        </span>

        <span className="inline-flex items-center gap-1">
          <GitFork size={14} weight="fill" />
          {project.forksCount}
        </span>

        <span className="ml-auto">更新于 {formatDate(project.updatedAt)}</span>
      </div>
    </a>
  );
}
