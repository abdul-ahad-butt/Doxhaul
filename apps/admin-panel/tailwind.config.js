/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#102a43', // Primary dark navy
          950: '#0A1830', // Hero/footer dark bg
        },
        slate: {
          50: '#F7F9FC',
          200: '#E2E8F0',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        blue: {
          600: '#3D5AFE',
          700: '#2A3FD6',
        },
        amber: {
          500: '#FF9F43',
        },
        violet: {
          600: '#7C3AED',
        },
        emerald: {
          600: '#059669',
        },
        brand: {
          blue: 'var(--color-blue-600)', // Action blue
          blueHover: 'var(--color-blue-700)',
          green: '#22c55e', // Success/Active
          amber: 'var(--color-amber-500)', // Pending/Warning
          purple: '#8b5cf6', // Transit/Tracking
          red: '#ef4444', // Cancelled/Rejected
        },
        background: '#f8fafc', // Soft gray-blue page background
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.025)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
