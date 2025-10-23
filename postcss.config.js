export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {
      overrideBrowserslist: [
        'Chrome >= 61',
        'Firefox >= 60', 
        'Safari >= 12',
        'Edge >= 18',
        '> 1%',
        'last 2 versions',
        'not dead',
        'not ie 11'
      ]
    },
  },
}