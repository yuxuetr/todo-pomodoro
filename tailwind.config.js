/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './index.html',
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [{
      mytheme: {
        "primary": "#00a7ff",
        "secondary": "#008b00",
        "accent": "#00ef00",
        "neutral": "#002926",
        "base-100": "#012535",
        "info": "#00a4f2",
        "success": "#00c38f",
        "warning": "#de5a00",
        "error": "#bd003a",
        },
      },
    ],
  },
  plugins: [require('daisyui')],
}

