const {nextui} = require("@nextui-org/react");


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/login/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",

  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        "purple-dark": {
          extend: "light", // <- inherit default values from dark theme
          colors: {
            background: "white",
            // foreground: "#f5f5f5",
            primary: {
              50: "#b12928",
              100: "#b12928",
              200: "#b12928",
              300: "#b12928",
              400: "#b12928",
              500: "#b12928",
              600: "#b12928",
              700: "#b12928",
              800: "#b12928",
              900: "#b12928",
              DEFAULT: "#b12928",
              // foreground: "#ffffff",
            },
            focus: "#b12928",
          },
          
        },
      },
    }),  
  ],
}
