import Link from 'next/link';

export const metadata = {
  title: 'About | Lemon Blog',
  description: 'About lemon and this blog',
};

const techStack = [
  'Java', 'Spring Boot', 'Spring Cloud',
  'MyBatis', 'MySQL', 'Redis',
  'Docker', 'Kubernetes', 'RabbitMQ',
  'Linux', 'Git',
];

const workExperience = [
  {
    period: '2025 - Present',
    company: 'Bogu Technology',
    description: 'Backend Development Engineer',
  },
  {
    period: '2024 - 2025',
    company: 'Huaxun',
    description: 'Backend Development Engineer',
  },
  {
    period: '2020 - 2024',
    company: 'UCAS',
    description: 'Software Engineer',
  },
  {
    period: '2018 - 2020',
    company: 'Art1001',
    description: 'Junior Developer',
  },
];

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com/lengmodkx' },
  { name: 'Twitter', href: 'https://twitter.com/DKX_LM' },
  { name: 'Telegram', href: 'https://t.me/lemon2Judy' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-paper-50 dark:bg-ink-DEFAULT">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-ink dark:text-text-primary mb-8">
          About Me
        </h1>

        <div className="prose dark:prose-invert max-w-none">
          {/* About Section */}
          <section className="mb-10">
            <p className="text-text-secondary mb-6 leading-relaxed">
              Hi, I&apos;m <span className="text-primary font-medium">lemon</span>, a Java backend developer from China.
              I have been working in software development for over 7 years, specializing in enterprise application development
              and distributed systems.
            </p>
            <p className="text-text-secondary mb-6 leading-relaxed">
              I am passionate about building scalable, high-performance applications and constantly exploring new technologies
              to improve my skills. Through this blog, I share my learning experiences, technical insights, and project practices.
            </p>
          </section>

          {/* Work Experience Section */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-ink dark:text-text-primary mb-4">
              Work Experience
            </h2>
            <div className="space-y-4">
              {workExperience.map((exp, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 bg-card rounded-lg border border-lavender-100 dark:border-lavender-800/50"
                >
                  <div className="w-24 text-sm text-text-muted shrink-0">
                    {exp.period}
                  </div>
                  <div>
                    <h3 className="font-medium text-ink dark:text-text-primary">
                      {exp.company}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tech Stack Section */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-ink dark:text-text-primary mb-4">
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-full bg-lavender-100 dark:bg-lavender-900/30 text-primary dark:text-lavender-400 text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-ink dark:text-text-primary mb-4">
              Get in Touch
            </h2>
            <p className="text-text-secondary mb-4">
              Feel free to reach out through any of the following channels:
            </p>
            <div className="space-y-2">
              <p className="text-text-secondary">
                <span className="font-medium">Email: </span>
                <a href="mailto:lengmodkx@gmail.com" className="text-primary hover:underline">
                  lengmodkx@gmail.com
                </a>
              </p>
              <div className="flex gap-4 pt-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-text-muted hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* Back to Home */}
          <section>
            <Link
              href="/"
              className="inline-flex items-center text-sm text-primary hover:text-primary-hover transition-colors"
            >
              ← Back to Home
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
