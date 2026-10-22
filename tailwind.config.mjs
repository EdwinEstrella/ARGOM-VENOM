import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './*.tsx', './components/**/*.tsx', './contexts/**/*.tsx', './src/**/*.{ts,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: '#00E0FF', // vibrant Cyan
                'background-light': '#f6f6f8',
                'background-dark': '#121212',
            },
            fontFamily: {
                display: ['"Space Grotesk Variable"', 'sans-serif'],
                sans: ['"Space Grotesk Variable"', 'sans-serif'],
                mono: ['monospace'],
            },
            borderRadius: {
                DEFAULT: '0.25rem',
                lg: '0.5rem',
                xl: '0.75rem',
                full: '9999px',
            },
        },
    },
    plugins: [forms, containerQueries],
};
