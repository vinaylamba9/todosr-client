export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nightblack: '#191923',
        babypowder: '#fbfef9',
        carrot: '#f39237',
        rosered: '#bf1363',
        myblue: '#0e79b2',
        // Add more custom colors as needed
      },
    },
    fontFamily: {
      sans: ['Plus Jakarta Sans' , 'sans-serif']
    },
  },
  plugins: [],
}