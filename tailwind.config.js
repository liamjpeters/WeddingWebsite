/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        'ms_madi': ['"Ms Madi"', 'cursive'],
        'satisfy': ['"Satisfy"', 'cursive'],
        'staatliches': ['"Staatliches"', 'cursive'],
        'poppins': ['"Poppins"', 'sans-serif'],
      },
      colors: {
        'background': '#3c6382',
        'accent': '#628362',
        'accent-dark': '#435e43',
      },
      backgroundImage: {
        'cork-pattern': "url('/img/wine-cork.png')",
      }
    },
  },
  plugins: [],
}

