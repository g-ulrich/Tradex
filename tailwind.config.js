module.exports = {
  purge: {
    enabled: true,
    content: ['./src/renderer/**/*.{js,jsx,ts,tsx}'],
    },
  content: ['./src/renderer/**/*.{js,jsx,ts,tsx}'],
    theme: {
      extend: {
        colors: {
          discord: {
            red: '#ED4245',
            softRed: 'rgba(237,66,69,.5)',
            green: 'rgb(87,242,135)',
            softGreen: 'rgba(87,242,135, .5)',
            white: '#f2f3f5',
            white2: '#d9dadc',
            blurple: '#7289DA',
            blurple2: '#5865f2',
            softBlurple: 'rgba(114, 137, 218, .5)',
            softBlurple2: 'rgba(88,101,242,.2)',
            darkGray: '#424549',
            darkerGray: '#36393E',
            darkestGray: '#282B30',
            black: '#1E2124',
          },
        },
      },
    },
    variants: {},
    plugins: [],
  };
