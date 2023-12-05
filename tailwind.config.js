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
            green: '#57F287',
            white: '#f2f3f5',
            white2: '#d9dadc',
            blurple: '#7289DA',
            blurple2: '#5865f2',
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