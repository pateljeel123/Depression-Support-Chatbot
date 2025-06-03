/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-out forwards',
        'spin': 'spin 1s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite',
        'typing': 'blink 1.4s infinite both',
        'slideUp': 'slideUp 0.5s ease-out forwards',
        'slideDown': 'slideDown 0.5s ease-out forwards',
        'meteor-effect': 'meteor 5s linear infinite',
        'orbit': 'orbit 20s linear infinite',
        'marquee': 'marquee var(--duration) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
          '50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' },
        },
        blink: {
          '0%': { opacity: 0.2 },
          '20%': { opacity: 1 },
          '100%': { opacity: 0.2 },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        meteor: {
          '0%': { transform: 'rotate(215deg) translateX(0)', opacity: 0 },
          '10%': { opacity: 1 },
          '70%': { opacity: 1 },
          '100%': {
            transform: 'rotate(215deg) translateX(-500px)',
            opacity: 0,
          },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
        'marquee-vertical': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(calc(-100% - var(--gap)))' },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
        'width': 'width',
        'transform': 'transform',
      },
      colors: {
        'primary': { // Soft Blue
          DEFAULT: '#4A90E2',
          hover: '#4178C2',
        },
        'secondary': { // Soft Teal
          DEFAULT: '#50E3C2',
        },
        'accent': { // Lavender
          DEFAULT: '#C1C8E4',
        },
        'background': { // Off White
          DEFAULT: '#F7F9FA',
          dark: '#121212',
        },
        'text': { // Text colors
          dark: '#333333',
          light: '#777777',
          white: '#EAEAEA',
        },
        'error': { // Light Red
          DEFAULT: '#FF6B6B',
        },
        'success': { // Light Green
          DEFAULT: '#7ED6A5',
        },
        'card': {
          light: '#FFFFFF',
          dark: '#1F1F1F',
        },
      },
      boxShadow: {
        'soft': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'message': '0 1px 3px rgba(0, 0, 0, 0.05)',
        'message-hover': '0 2px 5px rgba(0, 0, 0, 0.08)',
        'input': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        'DEFAULT': '12px',
        'bubble': '0.75rem',
        'button': '12px',
        'card': '12px',
        'input': '10px',
        'sm': '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(to right, var(--tw-gradient-stops))',
        'gradient-subtle': 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.02))',
      },
      opacity: {
        '15': '0.15',
        '35': '0.35',
        '85': '0.85',
        '95': '0.95',
      },
    },
  },
  plugins: [],
}