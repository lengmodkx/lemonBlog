export const metadata = {
  title: '关于 | Lemon Blog',
  description: '关于 Lemon 和这个博客',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-paper-50 dark:bg-ink-DEFAULT">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-ink dark:text-text-primary mb-8">
          关于
        </h1>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-ink-light dark:text-text-secondary mb-6">
            你好，我是 Lemon，一名热爱编程的软件工程师。
          </p>

          <h2 className="text-lg font-semibold text-ink dark:text-text-primary mb-3">
            关于我
          </h2>
          <p className="text-ink-light dark:text-text-secondary mb-6">
            我专注于 Web 开发，喜欢探索新技术，热衷于分享知识和经验。
          </p>

          <h2 className="text-lg font-semibold text-ink dark:text-text-primary mb-3">
            技术栈
          </h2>
          <div className="flex flex-wrap gap-2 mb-8">
            {['React', 'Next.js', 'TypeScript', 'Tailwind CSS'].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-full bg-lavender-100 dark:bg-lavender-900/30 text-primary dark:text-lavender-400 text-sm"
              >
                {tech}
              </span>
            ))}
          </div>

          <h2 className="text-lg font-semibold text-ink dark:text-text-primary mb-3">
            联系方式
          </h2>
          <ul className="text-ink-light dark:text-text-secondary space-y-2 text-sm">
            <li>Email: your-email@example.com</li>
            <li>GitHub: github.com/yourusername</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
