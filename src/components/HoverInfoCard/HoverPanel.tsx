'use client'

import { useState, useEffect } from 'react'
import ContactItem from './ContactItem'

interface BlogStats {
  postCount: number
  latestDate: string
}

interface HoverPanelProps {
  stats: BlogStats
}

export default function HoverPanel({ stats }: HoverPanelProps) {
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute left-full top-0 ml-4 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out z-10 sm:block hidden">
      <div
        className="backdrop-blur-md bg-white/90 dark:bg-ink-DEFAULT/90 border border-lavender-200 dark:border-lavender-800 rounded-xl shadow-xl p-4"
        role="tooltip"
        aria-label="Contact and blog information"
      >
        {/* Contact Section */}
        <div className="mb-4">
          <p className="text-xs font-medium text-text-muted mb-2 flex items-center gap-1">
            <span>📬</span>
            <span>联系方式</span>
          </p>
          <div className="space-y-1">
            <ContactItem
              icon="🔗"
              label="GitHub"
              href="https://github.com/lengmodkx"
            />
            <ContactItem
              icon="🐦"
              label="Twitter"
              href="https://twitter.com/DKX_LM"
            />
            <ContactItem
              icon="✈️"
              label="Telegram"
              href="https://t.me/lemon2Judy"
            />
            <ContactItem
              icon="📧"
              label="Email"
              href="mailto:lengmodkx@gmail.com"
            />
          </div>
        </div>

        {/* Blog Stats Section */}
        <div className="mb-4">
          <p className="text-xs font-medium text-text-muted mb-2 flex items-center gap-1">
            <span>📊</span>
            <span>博客统计</span>
          </p>
          <div className="space-y-1 text-xs text-text-muted">
            <p className="flex items-center gap-2">
              <span>📝</span>
              <span>文章: {stats.postCount} 篇</span>
            </p>
            <p className="flex items-center gap-2">
              <span>📅</span>
              <span>最新: {stats.latestDate}</span>
            </p>
          </div>
        </div>

        {/* Current Status Section */}
        <div>
          <p className="text-xs font-medium text-text-muted mb-2 flex items-center gap-1">
            <span>📍</span>
            <span>当前状态</span>
          </p>
          <div className="space-y-1 text-xs text-text-muted">
            <p className="flex items-center gap-2">
              <span>🌏</span>
              <span>中国</span>
            </p>
            <p className="flex items-center gap-2">
              <span>🕐</span>
              <span>{currentTime}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
