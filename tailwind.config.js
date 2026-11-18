/** @type {import('tailwindcss').Config} */
module.exports = {
  // Classes are written directly in the HTML and inside the JS that injects
  // the shared header/footer, so both need scanning.
  content: ['./*.html', './assets/js/*.js'],
  theme: {
    extend: {
      colors: {
        'tes-green': '#0e5d46',
        'tes-slate': '#0f493a',
        'tes-gold': '#d7b15d',
        ivory: '#fbf8f2',
      },
    },
  },
  plugins: [],
};
