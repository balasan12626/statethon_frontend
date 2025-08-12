/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Professional Government-Aligned Color Scheme
        // Light Theme: Blue & Saffron (Indian Flag Colors)
        primary: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#b8dfff',
          300: '#7cc7ff',
          400: '#36abff',
          500: '#0066cc', // Main Blue
          600: '#003366', // Dark Blue (Primary)
          700: '#002952',
          800: '#001f3d',
          900: '#001529',
          950: '#000c14',
        },
        secondary: {
          50: '#fffbf0',
          100: '#fff5d6',
          200: '#ffe8a8',
          300: '#ffd670',
          400: '#ffbf36',
          500: '#ff9933', // Saffron (Secondary)
          600: '#e6751a',
          700: '#cc5500',
          800: '#b34700',
          900: '#993d00',
          950: '#662900',
        },
        // Dark Theme: Navy & Gold (Professional)
        navy: {
          50: '#f7f8fc',
          100: '#eef1f8',
          200: '#d9e2f0',
          300: '#b8cae3',
          400: '#92abd3',
          500: '#738cc5',
          600: '#5c71b7',
          700: '#4f5ea7',
          800: '#435089',
          900: '#0a1f3a', // Deep Navy (Dark Theme Primary)
          950: '#0a1426',
        },
        gold: {
          50: '#fffef7',
          100: '#fffceb',
          200: '#fff8c7',
          300: '#fff29f',
          400: '#ffe866',
          500: '#ffd700', // Gold (Dark Theme Accent)
          600: '#e6c200',
          700: '#cc9900',
          800: '#b38600',
          900: '#996600',
          950: '#664400',
        },
        // Semantic Colors with High Contrast
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        // Professional shadow system
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.08), 0 10px 20px -2px rgba(0, 0, 0, 0.06)',
        'medium': '0 8px 30px -6px rgba(0, 0, 0, 0.12), 0 20px 40px -8px rgba(0, 0, 0, 0.08)',
        'hard': '0 20px 50px -12px rgba(0, 0, 0, 0.18), 0 30px 60px -12px rgba(0, 0, 0, 0.12)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'inner-lg': 'inset 0 4px 8px 0 rgba(0, 0, 0, 0.12)',
        
        // Light theme glows
        'glow-primary': '0 0 30px rgba(0, 51, 102, 0.2), 0 0 60px rgba(0, 51, 102, 0.1)',
        'glow-secondary': '0 0 30px rgba(255, 153, 51, 0.2), 0 0 60px rgba(255, 153, 51, 0.1)',
        'glow-success': '0 0 30px rgba(34, 197, 94, 0.2), 0 0 60px rgba(34, 197, 94, 0.1)',
        
        // Dark theme glows
        'glow-gold': '0 0 30px rgba(255, 215, 0, 0.15), 0 0 60px rgba(255, 215, 0, 0.1)',
        'glow-navy': '0 0 30px rgba(10, 31, 58, 0.3), 0 0 60px rgba(10, 31, 58, 0.2)',
        
        // Card shadows
        'card': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 6px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.12)',
        'card-active': '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.15)',
        
        // Button shadows
        'btn': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'btn-hover': '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.08)',
        'btn-active': '0 2px 4px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [import("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#003366",
          "secondary": "#ff9933", 
          "accent": "#0066cc",
          "neutral": "#f5f5f5",
          "base-100": "#ffffff",
          "info": "#0066cc",
          "success": "#22c55e",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
        dark: {
          "primary": "#ffd700",
          "secondary": "#0a1f3a",
          "accent": "#ffd700",
          "neutral": "#171717",
          "base-100": "#0a1f3a",
          "info": "#ffd700",
          "success": "#22c55e",
          "warning": "#f59e0b", 
          "error": "#ef4444",
        }
      }
    ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: false,
  },
}