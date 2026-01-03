'use client'

import Image from 'next/image'
import { useState } from 'react'

export default function FixedInfoCard() {
  const [imageError, setImageError] = useState(false)

  const profile = {
    name: 'lemon',
    title: 'Learner | Builder | Java Backend Developer',
    location: 'China',
    job: 'Backend Development Engineer',
    email: 'lengmodkx@gmail.com',
    avatar: '/images/avatar.jpg',
    socialLinks: {
      github: 'https://github.com/lengmodkx',
      twitter: 'https://twitter.com/DKX_LM',
      telegram: 'https://t.me/lemon2Judy'
    }
  }

  return (
    <div className="
      flex flex-col
      backdrop-blur-md bg-paper-50/80 dark:bg-ink-DEFAULT/80
      border border-lavender-200 dark:border-lavender-800
      rounded-2xl shadow-md p-5
      hover:scale-105
      hover:shadow-2xl
      hover:-translate-y-1
      hover:border-primary
      transition-all duration-300 ease-out
      h-full
    ">
      {/* Avatar Section */}
      <div className="flex justify-center mb-5">
        <div className="relative w-20 h-20">
          {!imageError ? (
            <Image
              src={profile.avatar}
              alt={profile.name}
              fill
              className="rounded-full object-cover shadow-lg"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full rounded-full bg-lavender-200 dark:bg-lavender-900/30 flex items-center justify-center text-3xl">
              👤
            </div>
          )}
        </div>
      </div>

      {/* Name & Title Section */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-ink dark:text-text-primary mb-1">
          <span className="text-primary">{profile.name}</span>
        </h2>
        <p className="text-xs text-text-secondary leading-relaxed">
          {profile.title}
        </p>
      </div>

      {/* Contact Info Section */}
      <div className="space-y-3 mb-4 text-xs">
        <p className="flex items-center gap-2 text-text-muted">
          <span className="shrink-0">📍</span>
          <span>{profile.location}</span>
        </p>
        <p className="flex items-center gap-2 text-text-muted">
          <span className="shrink-0">💼</span>
          <span>{profile.job}</span>
        </p>
        <a
          href={`mailto:${profile.email}`}
          className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors"
        >
          <span className="shrink-0">📧</span>
          <span>{profile.email}</span>
        </a>
      </div>

      {/* Social Links Section */}
      <div className="flex justify-center gap-4">
        <a
          href={profile.socialLinks.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="text-text-muted hover:text-primary transition-colors text-sm"
        >
          GitHub
        </a>
        <span className="text-text-muted">•</span>
        <a
          href={profile.socialLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
          className="text-text-muted hover:text-primary transition-colors text-sm"
        >
          Twitter
        </a>
        <span className="text-text-muted">•</span>
        <a
          href={profile.socialLinks.telegram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Telegram"
          className="text-text-muted hover:text-primary transition-colors text-sm"
        >
          Telegram
        </a>
      </div>
    </div>
  )
}
