/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                obsidian: {
                    950: '#050505', // Deepest black
                    900: '#0b0c10', // Background
                    800: '#15161a', // Surface
                    700: '#1f2026', // Border
                    600: '#2a2b32', // Lighter Border/Hover
                },
                acid: {
                    DEFAULT: '#ccff00', // Primary Accent
                    400: '#d9ff33',
                    500: '#ccff00',
                    600: '#b3e600',
                    900: '#334d00', // Dark text on acid
                },
                glass: {
                    border: 'rgba(255, 255, 255, 0.08)',
                    surface: 'rgba(255, 255, 255, 0.03)',
                    highlight: 'rgba(255, 255, 255, 0.1)',
                }
            },
            fontFamily: {
                sans: ['Manrope', 'sans-serif'],
                display: ['Space Grotesk', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            boxShadow: {
                'glow': '0 0 20px -5px rgba(204, 255, 0, 0.3)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            }
        },
    },
    plugins: [],
}
