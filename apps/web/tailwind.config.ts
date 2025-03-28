import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#e0f7e9',
          DEFAULT: '#4caf50',
          dark: '#388e3c',
        },
        secondary: {
          light: '#ffffff',
          DEFAULT: '#f5f5f5',
          dark: '#e0e0e0',
        },
      },
    },
  },
  plugins: [],
};

export default config;