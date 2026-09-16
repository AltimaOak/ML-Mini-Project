/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FAF8F5',
          100: '#F5F2EB',
          200: '#EBE5D9',
          300: '#DED7CB',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          warm: '#FDFCF9',
          subtle: '#F7F5F0',
        },
        utility: {
          charcoal: '#1C1917',
          secondary: '#57534E',
          muted: '#78716C',
          border: '#E5E0D8',
          borderHover: '#D4CDC0',
          orange: {
            DEFAULT: '#C25E00',
            hover: '#A95100',
            light: '#FFF7ED',
            border: '#FDBA74',
            dark: '#8C4300',
          },
          amber: {
            DEFAULT: '#D97706',
            light: '#FEF3C7',
          },
          green: {
            DEFAULT: '#15803D',
            light: '#F0FDF4',
            border: '#BBF7D0',
          },
          red: {
            DEFAULT: '#B91C1C',
            light: '#FEF2F2',
            border: '#FECACA',
          }
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif'
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace'
        ]
      },
      boxShadow: {
        'soft': '0 1px 3px 0 rgba(28, 25, 23, 0.04), 0 1px 2px -1px rgba(28, 25, 23, 0.04)',
        'card': '0 2px 6px -1px rgba(28, 25, 23, 0.06), 0 2px 4px -2px rgba(28, 25, 23, 0.04)',
        'elevated': '0 10px 15px -3px rgba(28, 25, 23, 0.06), 0 4px 6px -4px rgba(28, 25, 23, 0.04)',
      },
      borderRadius: {
        'utility': '14px',
      }
    },
  },
  plugins: [],
}
