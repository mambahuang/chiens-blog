/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // 確保有這一行，Tailwind 才會去讀 src/app 裡的檔案
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Kinpaku (gold leaf) × lacquer palette, adapted from impeccable.style.
      // Values resolve to CSS variables defined in globals.css so light/dark
      // swap automatically with the `.dark` class.
      colors: {
        lacquer: 'oklch(var(--lacquer) / <alpha-value>)',
        'lacquer-raised': 'oklch(var(--lacquer-raised) / <alpha-value>)',
        'lacquer-deep': 'oklch(var(--lacquer-deep) / <alpha-value>)',
        kinpaku: 'oklch(var(--kinpaku) / <alpha-value>)',
        'ink-accent': 'oklch(var(--ink-accent) / <alpha-value>)',
        'kinpaku-deep': 'oklch(var(--kinpaku-deep) / <alpha-value>)',
        'kinpaku-pale': 'oklch(var(--kinpaku-pale) / <alpha-value>)',
        patina: 'oklch(var(--patina) / <alpha-value>)',
        'patina-deep': 'oklch(var(--patina-deep) / <alpha-value>)',
        champagne: 'oklch(var(--champagne) / <alpha-value>)',
        'text-muted': 'oklch(var(--text-muted) / <alpha-value>)',
        'text-faint': 'oklch(var(--text-faint) / <alpha-value>)',
        rule: 'oklch(var(--rule))',
        'gold-ink': 'oklch(var(--gold-ink) / <alpha-value>)',
        'vec-1': 'oklch(var(--vec-1) / <alpha-value>)',
        'vec-3': 'oklch(var(--vec-3) / <alpha-value>)',
        'vec-4': 'oklch(var(--vec-4) / <alpha-value>)',
      },
      fontFamily: {
        // Order matters. 'Klee Kana' is unicode-range-locked to kana, so it
        // only ever claims Japanese syllabary and everything else falls
        // through: Latin to Alumni/Albert, Chinese (incl. kanji) to Noto TC.
        display: [
          'Klee Kana',
          'var(--font-alumni)',
          'var(--font-noto-tc)',
          'Arial',
          'sans-serif',
        ],
        sans: [
          'Klee Kana',
          'var(--font-albert)',
          'var(--font-noto-tc)',
          'system-ui',
          'sans-serif',
        ],
      },
      fontSize: {
        // `em`-based steps for the post figures: they resolve against the
        // figure container's font-size, so one change to that container scales
        // every label, cell and caption together. Tailwind's default sizes are
        // `rem` and would ignore it.
        'fig-3xs': ['0.625em', { lineHeight: '1.4' }],
        'fig-2xs': ['0.7em', { lineHeight: '1.45' }],
        'fig-xs': ['0.78em', { lineHeight: '1.5' }],
        'fig-sm': ['0.88em', { lineHeight: '1.55' }],
        'fig-base': ['1em', { lineHeight: '1.6' }],
        'fig-lg': ['1.15em', { lineHeight: '1.4' }],
      },
      borderRadius: {
        // Near-square lacquer corners.
        DEFAULT: '3px',
        sm: '2px',
        md: '3px',
        lg: '4px',
      },
      transitionTimingFunction: {
        lacquer: 'cubic-bezier(.2, .8, .2, 1)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};