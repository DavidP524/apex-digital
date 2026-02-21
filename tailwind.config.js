/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: "var(--primary)",
                accent: "var(--accent)",
                dark: "var(--dark)",
            },
            fontFamily: {
                heading: ["Inter", "sans-serif"],
                drama: ["Playfair Display", "serif"],
                data: ["JetBrains Mono", "monospace"],
            },
        },
    },
    plugins: [],
}
