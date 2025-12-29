'use client'

import React from 'react'
import HoverPanel from './HoverPanel'

interface BlogStats {
  postCount: number
  latestDate: string
}

interface HoverInfoCardProps {
  children: React.ReactNode
  stats: BlogStats
}

export default function HoverInfoCard({ children, stats }: HoverInfoCardProps) {
  return (
    <div className="relative group">
      {children}
      <HoverPanel stats={stats} />
    </div>
  )
}
