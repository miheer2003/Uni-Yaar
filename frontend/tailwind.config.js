/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Octet Minimalist Health-Track Inspired Palette
        canvas: '#DFDFE0',      // Christmas Silver - Page Background
        surface: '#FDFDFD',     // Brilliance - Card & Container Background
        lilac: {
          50: '#F8F7FA',
          100: '#F0EFF4',
          200: '#E1DFE9',
          300: '#CBC7D6',
          400: '#B6ADC3',       // Misty Lilac - Soft accent
          500: '#9B90AC',
          600: '#807493',
          700: '#675C78',
          800: '#524960',
          950: '#231E2A',
        },
        flamingo: {
          50: '#FEF1F3',
          100: '#FDE1E5',
          200: '#FBC4CC',
          300: '#F99DAA',
          400: '#F86B7E',       // Fiery Flamingo - Coral / Pink-Red
          500: '#EE495F',
          600: '#D92A42',
          700: '#B71E34',
          800: '#981B2D',
          900: '#7E1C2B',
        },
        primary: {
          50: '#F4F3FE',
          100: '#EAE8FE',
          200: '#D7D3FD',
          300: '#B7AFFC',
          400: '#9284FA',
          500: '#776BFD',       // Stargate Shimmer - Vibrant Indigo/Periwinkle
          600: '#6455F5',
          700: '#5241DC',
          800: '#4334B4',
          900: '#382D90',
          950: '#211B5A',
        },
        digital: {
          50: '#F7F7F8',
          100: '#EEEEF0',
          200: '#DADAE0',
          300: '#BDBDC6',
          400: '#9A9AA6',
          500: '#7B7B88',
          600: '#636363',       // Digital - Refined Mid-Dark Gray
          700: '#4F4F54',
          800: '#3D3D42',
          900: '#262629',
          950: '#18181B',       // Crisp Dark Heading
        },
        success: {
          500: '#10B981',
          600: '#059669',
        },
        warning: {
          500: '#F59E0B',
          600: '#D97706',
        },
        danger: {
          500: '#F86B7E',
          600: '#EE495F',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'clean': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'clean-lg': '0 10px 30px -3px rgba(0, 0, 0, 0.08)',
        'stargate': '0 8px 24px -4px rgba(119, 107, 253, 0.35)',
        'flamingo': '0 8px 24px -4px rgba(248, 107, 126, 0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
