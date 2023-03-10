module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './node_modules/flowbite-react/**/*.js',
  ],
  darkMode: 'media',
  theme: {
    fontFamily: {
      'cursive': ['Lobster'],
      'sans-serif': ['Lato']
    },
  },
  plugins: [
    require('flowbite/plugin')
  ]
}
