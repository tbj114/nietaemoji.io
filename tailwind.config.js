/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B6B',
        secondary: '#4ECDC4',
        background: '#F7F9FC',
        surface: '#FFFFFF',
        text: '#2D3748',
        muted: '#718096',
      },
      fontFamily: {
        sans: ['PingFang SC', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}