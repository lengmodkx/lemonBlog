import Link from 'next/link';
import { getLatestPosts } from '@/lib/posts';
import ArticleCard from '@/components/ArticleCard';

export const metadata = {
  title: 'Lemon Blog',
  description: 'Personal blog about web development, programming, and technology.',
};

export default function Home() {
  const latestPosts = getLatestPosts(5);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Personal Introduction Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-white font-bold text-5xl">L</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Howdy, fellow!
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-2">
              # I'm Lemon - a passionate software engineer
            </p>
          </div>

          <div className="max-w-3xl mx-auto text-left mb-8">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              I'm a learner, builder, and technology enthusiast.
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <p>🌍 I work mostly with web technologies.</p>
                <p>💻 I love React, Next.js, and TypeScript.</p>
                <p>☕ I enjoy good coffee and clean code.</p>
              </div>
              <div>
                <p>📚 I'm always learning new technologies.</p>
                <p>🎯 I focus on user experience and performance.</p>
                <p>🚀 I believe in continuous improvement.</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4 mt-4">
              I started this blog to document and share my knowledge & experience.
            </p>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <Link href="/blog" className="hover:text-blue-600 dark:hover:text-blue-400">
                📝 My writings
              </Link>
              <Link href="/blog" className="hover:text-blue-600 dark:hover:text-blue-400">
                🏷️ All tags
              </Link>
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
                📊 About me & this blog
              </a>
            </div>
          </div>
        </div>

        {/* Latest Posts Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Latest posts
            </h2>
            <Link
              href="/blog"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
            >
              View all posts →
            </Link>
          </div>

          {latestPosts.length > 0 ? (
            <div className="space-y-8">
              {latestPosts.map((post) => (
                <ArticleCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No articles yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Be the first to add some articles to the content/articles directory!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Happy reading</p>
        </div>
      </div>
    </div>
  );
}
