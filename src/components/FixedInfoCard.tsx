'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function FixedInfoCard() {
  return (
    <div className="flex flex-col bg-white/80 dark:bg-ink-DEFAULT/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-lavender-100 dark:border-lavender-900/30 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 hover:border-lavender-200 dark:hover:border-lavender-800/50 group">
      {/* Avatar */}
      <div className="flex justify-center mb-6">
        <div className="relative w-28 h-28 group-hover:scale-110 transition-transform duration-300">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-lavender-300 to-purple-300 dark:from-lavender-700 dark:to-purple-700 animate-pulse" />
          <Image
            src="/images/avatar.jpg"
            alt="lemon"
            fill
            className="rounded-full object-cover shadow-lg relative z-10"
          />
          <div className="absolute inset-0 rounded-full ring-2 ring-lavender-200 dark:ring-lavender-800 z-20" />
        </div>
      </div>

      {/* Name */}
      <h3 className="text-xl font-semibold text-ink dark:text-text-primary text-center mb-2 group-hover:text-primary transition-colors duration-300">
        KaiXin Deng
      </h3>

      {/* Title */}
      <p className="text-base text-primary text-center mb-3 font-medium">
        Learner | Builder
      </p>

      <p className="text-sm text-text-secondary text-center mb-6">
        Java Backend Developer
      </p>

      {/* Location */}
      <div className="flex items-center justify-center gap-2 text-sm text-text-muted mb-4 py-2 px-4 rounded-full bg-lavender-50 dark:bg-lavender-900/20 w-fit mx-auto">
        <span className="group-hover:scale-125 transition-transform duration-300">📍</span>
        <span>China</span>
      </div>

      {/* Email */}
      <div className="flex items-center justify-center gap-2 text-sm text-text-muted mb-6 py-2 px-4 rounded-full bg-lavender-50 dark:bg-lavender-900/20 w-fit mx-auto">
        <span className="group-hover:scale-125 transition-transform duration-300">📧</span>
        <a href="mailto:lengmodkx@gmail.com" className="hover:text-primary transition-colors">
          lengmodkx@gmail.com
        </a>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-lavender-300 dark:via-lavender-700 to-transparent mb-6" />

      {/* Social Links */}
      <div className="space-y-3">
        <a
          href="https://github.com/lengmodkx"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 text-base text-text-muted hover:text-primary transition-all duration-300 hover:translate-x-1 hover:bg-lavender-50 dark:hover:bg-lavender-900/20 px-3 py-2 rounded-lg"
        >
          <span className="group-hover:scale-110 transition-transform duration-300">🐙</span>
          <span className="flex-1">GitHub</span>
          <span className="text-xs text-text-muted/60">/lengmodkx</span>
        </a>
        <a
          href="https://twitter.com/DKX_LM"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 text-base text-text-muted hover:text-primary transition-all duration-300 hover:translate-x-1 hover:bg-lavender-50 dark:hover:bg-lavender-900/20 px-3 py-2 rounded-lg"
        >
          <span className="group-hover:scale-110 transition-transform duration-300">🐦</span>
          <span className="flex-1">Twitter</span>
          <span className="text-xs text-text-muted/60">/DKX_LM</span>
        </a>
        <a
          href="https://t.me/lemon2Judy"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 text-base text-text-muted hover:text-primary transition-all duration-300 hover:translate-x-1 hover:bg-lavender-50 dark:hover:bg-lavender-900/20 px-3 py-2 rounded-lg"
        >
          <span className="group-hover:scale-110 transition-transform duration-300">✈️</span>
          <span className="flex-1">Telegram</span>
          <span className="text-xs text-text-muted/60">/lemon2Judy</span>
        </a>
      </div>
    </div>
  );
}
