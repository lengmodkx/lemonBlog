'use client';

import { useState } from 'react';

const styles = [
  {
    id: 'handwritten',
    name: '手写笔记',
    nameEn: 'Handwritten Notes',
    description: '像一本打开的纸质笔记本，温暖、亲切、有人情味',
    colors: {
      bg: '#FDFBF7',
      text: '#2C3E33',
      accent: '#C75B39',
      secondary: '#F5F1E8',
      border: '#D4CFC4'
    },
    fonts: {
      heading: 'Patrick Hand, cursive',
      body: 'Inter, sans-serif'
    }
  },
  {
    id: 'editorial',
    name: '极简编辑',
    nameEn: 'Editorial Minimal',
    description: '高端杂志风格，精致排版，大量留白',
    colors: {
      bg: '#FFFFFF',
      text: '#1A1A1A',
      accent: '#B87333',
      secondary: '#FAFAFA',
      border: '#E5E5E5'
    },
    fonts: {
      heading: 'Playfair Display, serif',
      body: 'Source Serif 4, serif'
    }
  },
  {
    id: 'retro',
    name: '复古终端',
    nameEn: 'Retro Terminal',
    description: '90年代计算机风格，程序员的情怀',
    colors: {
      bg: '#0C1A0F',
      text: '#33FF33',
      accent: '#FFB000',
      secondary: '#0F2412',
      border: '#1A3A1F'
    },
    fonts: {
      heading: 'JetBrains Mono, monospace',
      body: 'JetBrains Mono, monospace'
    }
  },
  {
    id: 'wabisabi',
    name: '日式冷淡',
    nameEn: 'Wabi-Sabi',
    description: '侘寂美学，接受不完美，自然质朴',
    colors: {
      bg: '#F7F5F0',
      text: '#3A3A3A',
      accent: '#8B7355',
      secondary: '#EDE9E0',
      border: '#D4CFC4'
    },
    fonts: {
      heading: 'Noto Serif JP, serif',
      body: 'Inter, sans-serif'
    }
  },
  {
    id: 'swiss',
    name: '瑞士国际主义',
    nameEn: 'Swiss Design',
    description: '网格系统、功能性优先、经典现代主义',
    colors: {
      bg: '#FFFFFF',
      text: '#000000',
      accent: '#E30613',
      secondary: '#F5F5F5',
      border: '#000000'
    },
    fonts: {
      heading: 'Helvetica, Arial, sans-serif',
      body: 'Inter, sans-serif'
    }
  }
];

export default function StyleShowcase() {
  const [activeStyle, setActiveStyle] = useState(styles[0]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">博客风格选择器</h1>
          <p className="text-gray-600 mt-1">点击不同风格查看实际效果</p>
        </div>
      </div>

      {/* Style Selector */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-wrap gap-3 mb-8">
          {styles.map((style) => (
            <button
              key={style.id}
              onClick={() => setActiveStyle(style)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeStyle.id === style.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {style.name}
            </button>
          ))}
        </div>

        {/* Preview Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Style Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">风格信息</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-500 text-sm">名称</span>
                  <p className="font-medium text-gray-900">{activeStyle.name}</p>
                  <p className="text-sm text-gray-500">{activeStyle.nameEn}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">描述</span>
                  <p className="text-gray-700">{activeStyle.description}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">配色方案</span>
                  <div className="flex gap-2 mt-2">
                    {Object.entries(activeStyle.colors).map(([key, color]) => (
                      <div key={key} className="text-center">
                        <div
                          className="w-12 h-12 rounded-lg border border-gray-200"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-xs text-gray-500 mt-1 block">{key}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">字体</span>
                  <p className="text-gray-700">标题: {activeStyle.fonts.heading}</p>
                  <p className="text-gray-700">正文: {activeStyle.fonts.body}</p>
                </div>
              </div>
            </div>

            {/* Color Values */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">色值</h2>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(activeStyle.colors).map(([key, color]) => (
                  <div key={key} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded border border-gray-200"
                      style={{ backgroundColor: color }}
                    />
                    <div>
                      <span className="text-xs text-gray-500 uppercase">{key}</span>
                      <p className="text-sm font-mono text-gray-900">{color}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">实时预览</h2>
            <StylePreview style={activeStyle} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StylePreview({ style }: { style: typeof styles[0] }) {
  const isDark = style.id === 'retro';

  return (
    <div
      className="rounded-xl overflow-hidden border transition-all duration-300"
      style={{
        backgroundColor: style.colors.bg,
        borderColor: style.colors.border,
        color: style.colors.text,
        fontFamily: style.fonts.body
      }}
    >
      {/* Mock Blog Header */}
      <div
        className="px-6 py-4 border-b"
        style={{ borderColor: style.colors.border }}
      >
        <div className="flex items-center justify-between">
          <span
            className="text-xl font-bold"
            style={{ fontFamily: style.fonts.heading }}
          >
            Lemon Blog
          </span>
          <div className="flex gap-4 text-sm">
            <span>首页</span>
            <span>文章</span>
            <span>关于</span>
          </div>
        </div>
      </div>

      {/* Mock Content */}
      <div className="p-6">
        {/* Article Title */}
        <h1
          className="text-3xl mb-3 leading-tight"
          style={{
            fontFamily: style.fonts.heading,
            color: style.colors.text
          }}
        >
          探索编程的艺术之美
        </h1>

        {/* Meta */}
        <div
          className="text-sm mb-6 flex gap-4"
          style={{ color: style.id === 'retro' ? style.colors.text : style.colors.accent }}
        >
          <span>2024年3月15日</span>
          <span>阅读时间 5 分钟</span>
        </div>

        {/* Content */}
        <div className="space-y-4 text-base leading-relaxed">
          <p>
            编程不仅仅是一门技术，更是一门艺术。当我们写下每一行代码时，
            就像画家在画布上挥洒颜料， musician 在演奏乐器。
          </p>
          <p>
            好的代码应该像诗歌一样优美，简洁而有力。它不仅要能正确运行，
            更要让人读得懂、看得明白。
          </p>
        </div>

        {/* Subtitle */}
        <h2
          className="text-xl mt-8 mb-3"
          style={{
            fontFamily: style.fonts.heading,
            color: style.colors.text
          }}
        >
          代码示例
        </h2>

        {/* Code Block */}
        <div
          className="p-4 rounded mb-6 font-mono text-sm overflow-x-auto"
          style={{
            backgroundColor: style.colors.secondary,
            border: `1px solid ${style.colors.border}`
          }}
        >
          <code style={{ color: style.colors.text }}>
            <span style={{ color: style.colors.accent }}>function</span>
            {' '}greet(name) {'{'}
            <br />
            &nbsp;&nbsp;<span style={{ color: style.colors.accent }}>return</span>
            {' `Hello, ${name}!`;'}
            <br />
            {'}'}
          </code>
        </div>

        {/* Button */}
        <button
          className="px-6 py-2 rounded transition-all"
          style={{
            backgroundColor: style.colors.accent,
            color: isDark ? style.colors.bg : '#FFFFFF',
            borderRadius: style.id === 'handwritten' ? '2px 4px 3px 5px' : '4px'
          }}
        >
          阅读更多
        </button>

        {/* Card Example */}
        <div
          className="mt-6 p-4 rounded"
          style={{
            backgroundColor: style.colors.secondary,
            border: `1px solid ${style.colors.border}`,
            borderRadius: style.id === 'handwritten' ? '2px 4px 3px 5px' : '4px'
          }}
        >
          <h3
            className="text-lg mb-2"
            style={{ fontFamily: style.fonts.heading }}
          >
            相关文章
          </h3>
          <p className="text-sm opacity-80">
            探索更多关于编程、设计和创作的精彩内容。
          </p>
        </div>

        {/* Tags */}
        <div className="flex gap-2 mt-6">
          {['编程', '设计', '思考'].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm rounded"
              style={{
                backgroundColor: style.colors.secondary,
                color: style.colors.text,
                border: `1px solid ${style.colors.border}`
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Mock Footer */}
      <div
        className="px-6 py-4 border-t text-sm text-center"
        style={{ borderColor: style.colors.border, opacity: 0.7 }}
      >
        © 2024 Lemon Blog · 用心记录每一刻
      </div>
    </div>
  );
}
