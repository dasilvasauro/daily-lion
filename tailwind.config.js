/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Permite alternar tema claro/escuro facilmente
    theme: {
        extend: {
            colors: {
                // Nossas 6 cores "Accent"
                lion: {
                    steel: '#4682B4',
                    emerald: '#50C878',
                    purple: '#705E78',
                    gold: '#DAA520',
                    terracotta: '#E2725B',
                    charcoal: '#36454F'
                }
            },
            animation: {
                blob: "blob 7s infinite",
            },
            keyframes: {
                blob: {
                    "0%": { transform: "translate(0px, 0px) scale(1)" },
                    "33%": { transform: "translate(30px, -50px) scale(1.1)" },
                    "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
                    "100%": { transform: "translate(0px, 0px) scale(1)" },
                }
            }
        },
    },
    plugins: [],
}
