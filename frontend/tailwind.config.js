export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#F0F8FF',
          100: '#E0F0FE',
          200: '#BDE0FD',
          300: '#8ACAFC',
          400: '#52B1FA',
          500: '#2A9DF4',
          600: '#0071E3', // Apple Blue
          700: '#005BB5',
          800: '#004A94',
          900: '#003D7A',
          950: '#00264D',
        },
        apple: {
          gray: '#F2F2F7',
          darkGray: '#8E8E93',
          border: '#D1D1D6'
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
