'use client'

import React from 'react'

interface ContactItemProps {
  icon: string
  label: string
  href: string
}

export default function ContactItem({ icon, label, href }: ContactItemProps) {
  const isEmail = href.startsWith('mailto:')

  return (
    <a
      href={href}
      target={isEmail ? undefined : '_blank'}
      rel={isEmail ? undefined : 'noopener noreferrer'}
      className="flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors"
    >
      <span className="shrink-0">{icon}</span>
      <span>{label}</span>
    </a>
  )
}
