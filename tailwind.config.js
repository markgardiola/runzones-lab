/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Newsreader', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        paper: '#FAF8F4',
        ink: '#1B1B1A',
        muted: '#5F5F5A',
        line: '#E4E0D8',
        accent: '#C2410C',
        // Restrained, muted zone palette. Zones are always also labelled with
        // their number, so colour is never the only identifier.
        zone: {
          1: '#8FB3B0',
          2: '#A5B87F',
          3: '#DDC274',
          4: '#E0A070',
          5: '#C9776C',
        },
      },
    },
  },
  plugins: [],
};
