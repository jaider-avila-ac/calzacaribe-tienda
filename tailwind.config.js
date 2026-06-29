/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Acento de marca ─────────────────────────────────────────────────
        // Cambiar SOLO estos valores para actualizar el color en toda la app.
        // accent      → fondo de botones CTA, badges, highlights
        // accent-dark → hover de botones CTA
        // ────────────────────────────────────────────────────────────────────
        accent:        '#dc2626', // red-600
        'accent-dark': '#b91c1c', // red-700
      },
    },
  },
  plugins: [],
}