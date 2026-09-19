/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          bg: '#FFF8ED',
          panel: '#FFFFFF',
          border: '#EDE0CC',
          text: '#2B2118',
          muted: '#8F7D68',
        },
        accent: {
          DEFAULT: '#F2542D',
          hover: '#DE4520',
          light: '#FDEAE5',
          subtle: '#FFF1ED',
        },
        status: {
          clean: {
            DEFAULT: '#3FA34D',
            bg: '#EBF7EE',
            border: '#BFE3C6',
          },
          warning: {
            DEFAULT: '#E8A93B',
            bg: '#FEF8EB',
            border: '#F6DCAC',
          },
          failing: {
            DEFAULT: '#D93F3F',
            bg: '#FDF0F0',
            border: '#F6BCBC',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'flat': '0 1px 2px 0 rgba(43, 33, 24, 0.05)',
        'subtle': '0 2px 8px -2px rgba(43, 33, 24, 0.06)',
      },
    },
  },
  plugins: [],
}
