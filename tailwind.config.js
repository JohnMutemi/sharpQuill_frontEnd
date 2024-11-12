module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'media', // or 'class' if you prefer using class-based dark mode
  theme: {
    extend: {
      colors: {
        primaryLight: '#FFF7E1', // Beige
        primaryAccent: '#FFD966', // Goldenrod
        primaryDark: '#333333', // Charcoal
        secondary: '#B5A687', // Warm Gray
        highlight: '#FFEB3B', // Bright Yellow
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
