/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/*.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        denim: {
          // accent or secondary // indigo can also be used
          50: '#f1f5fd',
          100: '#e0eaf9',
          200: '#c7d9f6',
          300: '#a1c1ef',
          400: '#74a0e6',
          500: '#5480dd',
          600: '#3b61d0',
          700: '#3652bf',
          800: '#31449c',
          900: '#2c3c7c',
          950: '#1f264c',
        },
        fog: {
          50: '#f6f8f9',
          100: '#ebeff3',
          200: '#d3dce4',
          300: '#acbecd',
          400: '#7f9bb1',
          500: '#5f7f98',
          600: '#4b677e',
          700: '#435a6f',
          800: '#364756',
          900: '#303d4a',
          950: '#202831',
        },
        background: {
          lighter: '#f8fafc', // slate-50
          light: '#f1f5f9', // slate-100
          DEFAULT: '#e2e8f0', // slate-200
          dark: '#cbd5e1', // slate-300
        },
        // divider: {
        //   light: '#f1f5f9',
        //   dark: '#cbd5e1',
        //   DEFAULT: '#f1f5f9',
        // },

        // primary: {
        //   light: '#f8fafc',
        //   dark: '#f1f5f9',
        //   contrast: '#fdfdfd',
        //   DEFAULT: '#fff',
        // },
        // secondary: {
        //   light: '#94a3b8',
        //   dark: '#0f172a',
        //   DEFAULT: '#64748b',
        // },
        // accent: {
        //   light: '#74a0e6',
        //   dark: '#3b61d0',
        //   contrast: '#fff',
        //   DEFAULT: '#5480dd',
        // },
      },
    },
    fontFamily: {
      openSans: ['Open Sans', 'sans-serif'],
      anticDidone: ['Antic Didone', 'serif'],
      montserrat: ['Montserrat', 'sans-serif'],
    },
  },
  plugins: [require('daisyui'), require('@tailwindcss/forms')],
  daisyui: {
    // themes: false,
    themes: [],
    // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    // darkTheme: 'dark',
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
