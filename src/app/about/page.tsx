import Link from 'next/link';
import { Envelope, ArrowLeft, ArrowUpRight } from '@phosphor-icons/react/dist/ssr';

export const metadata = {
  title: 'About | Lemon Blog',
  description: 'About lemon and this blog',
};

const techStack = [
  'Java', 'Spring Boot', 'Spring Cloud',
  'MyBatis', 'MySQL', 'Redis',
  'Docker', 'RabbitMQ', 'Python',
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

const friendLinks = [
  { name: 'cxhello', href: 'https://cxhello.top/about' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-16 md:py-20">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-10 transition-colors"
        >
          <ArrowLeft size={14} weight="bold" />
          返回首页
        </Link>

        <h1 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight mb-8">
          关于我
        </h1>

        <section className="mb-12">
          <p className="text-muted-foreground leading-relaxed mb-4">
            Hi, I&apos;m <span className="text-foreground font-medium">lemon</span>, a Java backend developer from China.
            I have been working in software development for over 7 years, specializing in enterprise application development
            and distributed systems.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            I am passionate about building scalable, high-performance applications and constantly exploring new technologies
            to improve my skills. Through this blog, I share my learning experiences, technical insights, and project practices.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-lg font-semibold text-foreground mb-5 tracking-tight">
            工作经历
          </h2>
          <div className="border-l border-border pl-6 space-y-8">
            {workExperience.map((exp, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-[25px] top-1.5 w-2 h-2 rounded-full bg-accent ring-4 ring-background" />
                <div className="text-sm text-muted-foreground mb-1">
                  {exp.period}
                </div>
                <h3 className="font-medium text-foreground">
                  {exp.company}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-lg font-semibold text-foreground mb-5 tracking-tight">
            技术栈
          </h2>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm border border-border"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-lg font-semibold text-foreground mb-5 tracking-tight">
            友链
          </h2>
          <div className="grid gap-3">
            {friendLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-accent transition-colors"
              >
                <div>
                  <h3 className="font-medium text-foreground group-hover:text-accent transition-colors">
                    {link.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {link.href}
                  </p>
                </div>
                <ArrowUpRight
                  size={18}
                  weight="bold"
                  className="text-muted-foreground group-hover:text-accent transition-colors"
                />
              </a>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-lg font-semibold text-foreground mb-5 tracking-tight">
            联系方式
          </h2>
          <div className="space-y-4">
            <a
              href="mailto:lengmodkx@gmail.com"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
            >
              <Envelope size={18} weight="regular" />
              <span>lengmodkx@gmail.com</span>
            </a>
            <div className="flex items-center gap-6">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
