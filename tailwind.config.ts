import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
      },
      colors: {
        brand: {
          DEFAULT: '#0ea5e9',
          dark: '#0369a1',
          light: '#38bdf8',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
