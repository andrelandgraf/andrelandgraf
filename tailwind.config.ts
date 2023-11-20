import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx,jsx,js}', './contents/**/*.md'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: 'rgb(94 234 212)', // teal-300
        secondary: 'rgb(45 212 191)', // teal-400
        primaryAccent: 'rgb(20 184 166)', // teal-500
        primaryDark: 'rgb(19 78 74)', // teal-900
        primaryDarkAccent: 'rgb(17 94 89)', // teal-800
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
      maxWidth: {
        wide: '1920px',
        ultraWide: '2400px',
      },
      fontFamily: {
        gamified: ['"Press Start 2P"', 'cursive'],
      },
      screens: {
        /**
         * sometimes its nice to say: mobileOnly: without needing to reset it with md:...
         */
        mobile: { max: '639px' },
        /**
         * for very big screens
         */
        wide: { min: '1920px' },
        /**
         * for very very big screens
         */
        ultraWide: { min: '2400px' },
      },
    },
  },
  variants: {},
  plugins: [],
} satisfies Config;
