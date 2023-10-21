import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx,jsx,js}', './contents/**/*.md'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: 'rgb(94 234 212)', // teal-300
        secondary: 'rgb(45 212 191)', // teal-400
        darkPrimary: 'rgb(20 184 166)', // teal-500
        red: '#ff0000',
        orange: '#ff9a00',
        yellow: '#d0de21',
        green: '#4fdc4a',
        blue: '#3fdad8',
        purple: '#5f15f2',
        fuchsia: '#fb07d9',
        packtOrange: '#f97141',
        allThingsWebPurple: '#D13ABD',
        allThingsWebOrange: '#EEBD89',
      },
      fontFamily: {
        gamified: ['"Press Start 2P"', 'cursive'],
      },
      screens: {
        /**
         * sometimes its nice to say: mobileOnly: without needing to reset it with md:...
         */
        mobile: { max: '639px' },
      },
    },
  },
  variants: {},
  plugins: [],
} satisfies Config;