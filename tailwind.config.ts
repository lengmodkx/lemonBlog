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
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'rgb(55 65 81)',
            hr: {
              borderColor: 'rgb(229 231 235)',
              marginTop: '3em',
              marginBottom: '3em',
            },
            h1: {
              fontWeight: '800',
              fontSize: '2.25em',
              marginTop: '0',
              marginBottom: '0.8888889em',
              lineHeight: '1.1111111',
            },
            h2: {
              fontWeight: '700',
              fontSize: '1.5em',
              marginTop: '2em',
              marginBottom: '1em',
              lineHeight: '1.3333333',
            },
            h3: {
              fontWeight: '600',
              fontSize: '1.25em',
              marginTop: '1.6em',
              marginBottom: '0.6em',
              lineHeight: '1.6',
            },
            'h4,h5,h6': {
              fontWeight: '600',
              marginTop: '1.5em',
              marginBottom: '0.5em',
              lineHeight: '1.5',
            },
            p: {
              marginTop: '1.25em',
              marginBottom: '1.25em',
            },
            a: {
              color: 'rgb(37 99 235)',
              textDecoration: 'none',
              fontWeight: '500',
              '&:hover': {
                color: 'rgb(29 78 216)',
                textDecoration: 'underline',
              },
            },
            blockquote: {
              fontWeight: '500',
              fontStyle: 'italic',
              color: 'rgb(75 85 99)',
              borderLeftWidth: '0.25rem',
              borderLeftColor: 'rgb(229 231 235)',
              quotes: '"\\201C""\\201D""\\2018""\\2019"',
              paddingLeft: '1em',
            },
            code: {
              color: 'rgb(17 24 39)',
              fontWeight: '600',
              fontSize: '0.875em',
              backgroundColor: 'rgb(243 244 246)',
              padding: '0.25rem 0.375rem',
              borderRadius: '0.25rem',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              color: 'rgb(229 231 235)',
              backgroundColor: 'rgb(17 24 39)',
              overflowX: 'auto',
              borderRadius: '0.5rem',
              padding: '1rem',
            },
            'pre code': {
              backgroundColor: 'transparent',
              borderWidth: '0',
              borderRadius: '0',
              padding: '0',
              fontWeight: '400',
              color: 'inherit',
              fontSize: 'inherit',
              fontFamily: 'inherit',
              lineHeight: 'inherit',
            },
            'pre code::before': {
              content: '""',
            },
            'pre code::after': {
              content: '""',
            },
            table: {
              width: '100%',
              tableLayout: 'auto',
              textAlign: 'left',
              marginTop: '2em',
              marginBottom: '2em',
              fontSize: '0.875em',
              lineHeight: '1.7142857',
            },
            thead: {
              color: 'rgb(17 24 39)',
              fontWeight: '600',
              borderBottomWidth: '1px',
              borderBottomColor: 'rgb(229 231 235)',
            },
            'thead th': {
              verticalAlign: 'bottom',
              paddingRight: '0.5714286em',
              paddingBottom: '0.5714286em',
              paddingLeft: '0.5714286em',
            },
            'tbody tr': {
              borderBottomWidth: '1px',
              borderBottomColor: 'rgb(229 231 235)',
            },
            'tbody tr:last-child': {
              borderBottomWidth: '0',
            },
            'tbody td': {
              verticalAlign: 'top',
              paddingTop: '0.5714286em',
              paddingRight: '0.5714286em',
              paddingBottom: '0.5714286em',
              paddingLeft: '0.5714286em',
            },
          },
        },
        dark: {
          css: {
            color: 'rgb(229 231 235)',
            hr: {
              borderColor: 'rgb(55 65 81)',
            },
            h1: {
              color: 'rgb(243 244 246)',
            },
            h2: {
              color: 'rgb(243 244 246)',
            },
            h3: {
              color: 'rgb(243 244 246)',
            },
            'h4,h5,h6': {
              color: 'rgb(243 244 246)',
            },
            a: {
              color: 'rgb(96 165 250)',
              '&:hover': {
                color: 'rgb(147 197 253)',
              },
            },
            blockquote: {
              color: 'rgb(156 163 175)',
              borderLeftColor: 'rgb(55 65 81)',
            },
            code: {
              backgroundColor: 'rgb(31 41 55)',
              color: 'rgb(243 244 246)',
            },
            thead: {
              color: 'rgb(243 244 246)',
              borderBottomColor: 'rgb(55 65 81)',
            },
            'tbody tr': {
              borderBottomColor: 'rgb(55 65 81)',
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