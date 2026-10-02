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
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#36abf7',
          500: '#0c8fe9',
          600: '#0271c7',
          700: '#035aa2',
          800: '#074c85',
          900: '#0c406e',
        },
        tint: {
          cream: '#FFFDF5',
          softYellow: '#FFF9D2',
          softBlue: '#EDF5FC',
          softPeach: '#FFF3EB',
          softGreen: '#EDF8F2',
          softRose: '#FDF2F4'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        dyslexic: ['OpenDyslexic', 'Comic Sans MS', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
