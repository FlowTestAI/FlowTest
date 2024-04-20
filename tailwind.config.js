/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/*.html'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    // themes: false,
    themes: [
      {
        // light: {
        //   primary: '#245760',
        //   'primary-focus': '#142e32',
        //   'primary-content': '#ffffff',

        //   secondary: '#579e92',
        //   'secondary-focus': '#365859',
        //   'secondary-content': '#ffffff',

        //   accent: '#37cdbe',
        //   'accent-focus': '#2ba69a',
        //   'accent-content': '#ffffff',

        //   neutral: '#3b424e',
        //   'neutral-focus': '#2a2e37',
        //   'neutral-content': '#ffffff',

        //   'base-100': '#ffffff',
        //   'base-200': '#f9fafb',
        //   'base-300': '#ced3d9',
        //   'base-content': '#142e32',

        //   info: '#1c92f2',
        //   success: '#009485',
        //   warning: '#ff9900',
        //   error: '#ff5724',

        //   '--rounded-box': '0.5rem',
        //   '--rounded-btn': '.5rem',
        //   '--rounded-badge': '1rem',

        //   '--animation-btn': '.25s',
        //   '--animation-input': '.2s',

        //   '--btn-text-case': 'uppercase',
        //   '--navbar-padding': '.5rem',
        //   '--border-btn': '1px',
        // },
        pastel: {
          ...require('daisyui/src/theming/themes')['pastel'],

          // Borders
          '--rounded-btn': '0.5rem',
        },
      },
    ],
    // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: 'dark',
    // name of one of the included themes for dark mode
    base: true,
    // applies background color and foreground color for root element by default
    styled: true,
    // include daisyUI colors and design decisions for all components
    utils: true,
    // adds responsive and modifier utility classes
    prefix: '',
    // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true,
    // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ':root', // The element that receives theme color CSS variables
  },
};
