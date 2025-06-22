/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        olive: {
          50: '#F8FAF0',
          100: '#EFF3E0',
          200: '#DFE7C2',
          300: '#CADA9F',
          400: '#B0C373',
          500: '#95AD52',
          600: '#788C42',
          700: '#5F6F34',
          800: '#4A5628',
          900: '#2E361A',
        },
        teal: {
          50: '#EFFCF6',
          100: '#C6F7E2',
          200: '#8EEDC7',
          300: '#65D6AD',
          400: '#3EBD93',
          500: '#27AB83',
          600: '#199473',
          700: '#147D64',
          800: '#0C6B58',
          900: '#014D40',
        },
        sage: {
          50: '#F6F9F3',
          100: '#ECF3E6',
          200: '#DAE8CE',
          300: '#C1D8AF',
          400: '#A9C88F',
          500: '#8FB36F',
          600: '#738F59',
          700: '#5B7247',
          800: '#465837',
          900: '#2C3722',
        },
        khaki: {
          50: '#FBFAF3',
          100: '#F6F5E5',
          200: '#EFEBCB',
          300: '#E7E0AD',
          400: '#D9CF84',
          500: '#CEC05B',
          600: '#B6A83F',
          700: '#8E8331',
          800: '#6B6225',
          900: '#433E18',
        },
        beige: {
          50: '#FDFCF7',
          100: '#FBF9EE',
          200: '#F7F3DE',
          300: '#F2ECCC',
          400: '#E8DBA8',
          500: '#DEC983',
          600: '#D2B357',
          700: '#BE9A2F',
          800: '#8F7526',
          900: '#5F4D19',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};

export default config;
