/** @type {import('tailwindcss').Config} */
export default {
  prefix: 'rfp-',
  important: '.rfp-root',
  corePlugins: {
    preflight: false,
  },
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

