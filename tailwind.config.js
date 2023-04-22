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
    extend: {
      colors: {
        'primary-l': '#991b1b',
        'primary': '#7f1d1d',
        'primary-d': '#450a0a',
        'secondary-l': '#cbd5e1',
        'secondary': '#64748b',
        'secondary-d': '#334155',
        // 'tertiary-l': '#99f6e4',
        // 'tertiary': '#5eead4',
        // 'tertiary-d': '#0d9488',
      }
    }
  },
  plugins: [
    require('flowbite/plugin')
  ]
}
