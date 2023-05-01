module.exports = {
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
         * add override screen breakpoint:
         * CSS is strange.
         * In the UI components folder, we use `mx-auto flex ... ${className}`
         * as a way to create base styling for a component but allow
         * bascially re-arrangements in the parent classes
         * thereby className is not inteded to re-design the child entierly
         * but to add a quick ml-auto or flex-grow to fit the layout
         * BUT only because className is set at the end of the cascade doesn't mean its overriding
         * the base css.
         * That also depends on the order off the css in the stylesheets (... yeah ...)
         * And that's up to tailwind
         * A workaround would be to not use ${className} and rather use micro props
         * margin = 2px
         * small = true
         * color = red
         * to style `${margin ? margin : mx-auto} flex ${color ? color : red-500} ${small ? w-10 : w-20}`
         * but I really dont like it since its not extensible
         * bascially for every little layout re-arrangement, you need to adapt the child component
         * and add another flag for another edge case...
         *
         * how override: works
         * override is a new screen breakpoint that always applies (if app bigger than 0)
         * so if you got a mx-auto and you want to remove it in the parent via mx-0
         * but mx-auto won't let itself override because its higher up in the stylesheet
         * slap a override:mx-0 in the className which is more specific and thus takes
         * over!
         *
         * Yes: this allows only for one level of override
         * You cannot override the override but usually we have a parent that wants to control its child and not more
         *
         * Yes: override: does not work well with w or h or text or anything where you already use other
         * sm:... md:... because they will override override: since they are more specific.
         * In that case, you need to reach for an prop flag e.g. smallText = true
         */
        override: '0',
      },
    },
  },
  variants: {},
  plugins: [],
};
