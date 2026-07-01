'use client'

import Image from 'next/image'
import { useState } from 'react'
import { MapPin, Briefcase, Envelope, GithubLogo, TwitterLogo, PaperPlaneRight } from '@phosphor-icons/react'

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
    <div className="flex flex-col bg-card border border-border rounded-xl shadow-sm p-6 h-full hover:shadow-md transition-shadow">
      <div className="flex justify-center mb-5">
        <div className="relative w-20 h-20">
          {!imageError ? (
            <Image
              src={profile.avatar}
              alt={profile.name}
              fill
              sizes="80px"
              className="rounded-full object-cover ring-2 ring-border"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full rounded-full bg-muted flex items-center justify-center text-2xl text-muted-foreground">
              {profile.name[0].toUpperCase()}
            </div>
          )}
        </div>
      </div>

      <div className="text-center mb-5">
        <h2 className="text-xl font-semibold text-foreground mb-1">
          {profile.name}
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {profile.title}
        </p>
      </div>

      <div className="space-y-3 mb-5 text-sm">
        <p className="flex items-center gap-2 text-muted-foreground">
          <MapPin size={16} weight="regular" />
          <span>{profile.location}</span>
        </p>
        <p className="flex items-center gap-2 text-muted-foreground">
          <Briefcase size={16} weight="regular" />
          <span>{profile.job}</span>
        </p>
        <a
          href={`mailto:${profile.email}`}
          className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
        >
          <Envelope size={16} weight="regular" />
          <span>{profile.email}</span>
        </a>
      </div>

      <div className="flex justify-center gap-4 mt-auto">
        <a
          href={profile.socialLinks.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <GithubLogo size={18} weight="regular" />
        </a>
        <a
          href={profile.socialLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <TwitterLogo size={18} weight="regular" />
        </a>
        <a
          href={profile.socialLinks.telegram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Telegram"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <PaperPlaneRight size={18} weight="regular" />
        </a>
      </div>
    </div>
  )
}
