/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E3A5F', // Navy Blue
          light: '#2D5180',
          dark: '#132845',
        },
        secondary: {
          DEFAULT: '#C9A84C', // Gold
          light: '#DEBE61',
          dark: '#B08F38',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        accent: '#D0E1F9',
        dark: '#0F172A',
        light: '#F8FAFC',
      },
      fontFamily: {
        arabic: ['Cairo', 'Tajawal', 'sans-serif'],
        english: ['Inter', 'sans-serif'],
        sans: ['Cairo', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
