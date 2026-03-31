import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        hand: ['var(--font-patrick-hand)', 'Caveat', 'cursive'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        // 手写笔记风格
        paper: {
          DEFAULT: '#FDFBF7',
          dark: '#F5F1E8',
        },
        ink: {
          DEFAULT: '#2C3E33',
          light: '#4A6355',
        },
        accent: {
          DEFAULT: '#C75B39',
          muted: '#D97B5D',
        },
        pencil: '#3D3D3D',
        border: '#D4CFC4',
      },
      borderRadius: {
        'hand': '2px 4px 3px 5px',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            '--tw-prose-body': '#3D3D3D',
            '--tw-prose-headings': '#2C3E33',
            '--tw-prose-links': '#C75B39',
            '--tw-prose-bold': '#2C3E33',
            '--tw-prose-counters': '#4A6355',
            '--tw-prose-bullets': '#C75B39',
            '--tw-prose-hr': '#D4CFC4',
            '--tw-prose-quotes': '#4A6355',
            '--tw-prose-quote-borders': '#C75B39',
            '--tw-prose-captions': '#4A6355',
            '--tw-prose-code': '#C75B39',
            '--tw-prose-pre-code': '#2C3E33',
            '--tw-prose-pre-bg': '#F5F1E8',
            '--tw-prose-th-borders': '#D4CFC4',
            '--tw-prose-td-borders': '#D4CFC4',
            hr: {
              borderColor: '#D4CFC4',
              marginTop: '2.5em',
              marginBottom: '2.5em',
            },
            h1: {
              fontWeight: '600',
              fontSize: '2.25em',
              marginTop: '0',
              marginBottom: '1em',
              lineHeight: '1.2',
            },
            h2: {
              fontWeight: '600',
              fontSize: '1.75em',
              marginTop: '2em',
              marginBottom: '0.75em',
              lineHeight: '1.3',
              paddingBottom: '0.25em',
              borderBottomWidth: '2px',
              borderBottomColor: '#D4CFC4',
            },
            h3: {
              fontWeight: '600',
              fontSize: '1.375em',
              marginTop: '1.75em',
              marginBottom: '0.5em',
              lineHeight: '1.4',
            },
            p: {
              marginTop: '0',
              marginBottom: '1.5em',
              lineHeight: '1.8',
            },
            a: {
              color: '#C75B39',
              textDecoration: 'none',
              fontWeight: '500',
              borderBottomWidth: '1px',
              borderBottomColor: 'transparent',
              transition: 'border-color 0.15s ease',
              '&:hover': {
                borderBottomColor: '#C75B39',
              },
            },
            blockquote: {
              borderLeftWidth: '3px',
              borderLeftColor: '#C75B39',
              paddingLeft: '1.25em',
              margin: '1.5em 0',
              fontStyle: 'italic',
              color: '#4A6355',
            },
            code: {
              color: '#C75B39',
              fontWeight: '500',
              fontSize: '0.875em',
              backgroundColor: '#F5F1E8',
              padding: '0.15em 0.4em',
              borderRadius: '2px',
            },
            pre: {
              color: '#2C3E33',
              backgroundColor: '#F5F1E8',
              overflowX: 'auto',
              borderRadius: '2px 4px 3px 5px',
              padding: '1.25rem',
              border: '1px solid #D4CFC4',
            },
            img: {
              borderRadius: '2px',
              margin: '2em auto',
            },
          },
        },
        dark: {
          css: {
            '--tw-prose-body': '#B0C0B2',
            '--tw-prose-headings': '#E8F0E9',
            '--tw-prose-links': '#D97B5D',
            '--tw-prose-bold': '#E8F0E9',
            '--tw-prose-counters': '#A8B8AA',
            '--tw-prose-bullets': '#D97B5D',
            '--tw-prose-hr': '#3A453D',
            '--tw-prose-quotes': '#A8B8AA',
            '--tw-prose-quote-borders': '#D97B5D',
            '--tw-prose-captions': '#A8B8AA',
            '--tw-prose-code': '#D97B5D',
            '--tw-prose-pre-code': '#E8F0E9',
            '--tw-prose-pre-bg': '#232925',
            '--tw-prose-th-borders': '#3A453D',
            '--tw-prose-td-borders': '#3A453D',
            hr: {
              borderColor: '#3A453D',
            },
            h1: {
              color: '#E8F0E9',
            },
            h2: {
              color: '#E8F0E9',
              borderBottomColor: '#3A453D',
            },
            h3: {
              color: '#E8F0E9',
            },
            a: {
              color: '#D97B5D',
              '&:hover': {
                borderBottomColor: '#D97B5D',
              },
            },
            blockquote: {
              color: '#A8B8AA',
              borderLeftColor: '#D97B5D',
            },
            code: {
              backgroundColor: '#232925',
              color: '#D97B5D',
            },
            pre: {
              backgroundColor: '#232925',
              borderColor: '#3A453D',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
} satisfies Config;
