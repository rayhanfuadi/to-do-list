/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["*.{html,js}"],
  theme: {
    extend: {
      colors:{
        primary: '#FFF01F',
        dark: '#0C0B02',
        light: '#FFFEF3',
        merah: '#FF3131',
        oren: '#FF5E00',
        gray: '#8C8C8C',
       },
       boxShadow: {
        'box1': '0 4px 8px 0 rgba(255,240,31,0.15)',
        'box2': '1px 1px 0 0 rgba(255,240,31,1)',
       }
    },
  },
  plugins: [],
}

