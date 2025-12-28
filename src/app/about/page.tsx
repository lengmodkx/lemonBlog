export const metadata = {
  title: '关于 | Lemon Blog',
  description: '关于 Lemon 和这个博客',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-paper-50 dark:bg-ink-DEFAULT">
      <div className="max-w-3xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-ink dark:text-text-primary mb-8">
          关于
        </h1>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-xl text-ink-light dark:text-text-secondary mb-8">
            你好，我是 Lemon，一名热爱编程的软件工程师。
          </p>

          <h2 className="text-2xl font-semibold text-ink dark:text-text-primary mb-4">
            关于我
          </h2>
          <p className="text-ink-light dark:text-text-secondary mb-6">
            我专注于 Web 开发，喜欢探索新技术，热衷于分享知识和经验。
            这个博客是我记录学习心得、技术总结和项目实践的地方。
          </p>

          <h2 className="text-2xl font-semibold text-ink dark:text-text-primary mb-4">
            技术栈
          </h2>
          <div className="flex flex-wrap gap-2 mb-8">
            {['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'MySQL'].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-full bg-white dark:bg-gray-800 text-accent dark:text-accent-dark shadow-sm"
              >
                {tech}
              </span>
            ))}
          </div>

          <h2 className="text-2xl font-semibold text-ink dark:text-text-primary mb-4">
            联系方式
          </h2>
          <p className="text-ink-light dark:text-text-secondary">
            欢迎通过以下方式与我交流：
          </p>
          <ul className="list-disc list-inside text-ink-light dark:text-text-secondary mt-4 space-y-2">
            <li>Email: your-email@example.com</li>
            <li>GitHub: github.com/yourusername</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
