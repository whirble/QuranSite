/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.html', './src/**/*.js'], // Detect all .html files in all folders
  theme: {
    extend: {
      gradientColorStops: theme => ({
        ...theme('colors'),
        olive: '#1f2125',
        darkblack: '#1f2125',
        white: '#fff',
        black: '#000',
        main : '#ffffff1a',
      }),
      fontFamily: {
        reemKufi: ['"Reem Kufi"', 'sans-serif'],
        amiri: ['"Amiri"', 'serif'],
        Lateef: ['"Lateef"', 'serif'],
      },
      textStroke: {
        DEFAULT: '1px',
        sm: '0.5px',
        lg: '2px',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.text-stroke-white': {
          '-webkit-text-stroke': '1px white',
        },
      });
    },
  ],
}

