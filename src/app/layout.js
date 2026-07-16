// src/app/layout.js
import { Manrope, Alumni_Sans, Noto_Serif_TC } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";

// Latin + numerals body face. Keeps the --font-albert variable name so the
// Tailwind font stack (with its Klee Kana / Noto TC fallbacks) is unchanged.
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-albert",
});

const alumni = Alumni_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-alumni",
});

// Traditional Chinese body face. Google serves the CJK glyphs in unicode-range
// slices, so browsers fetch only what the page actually uses.
const notoSerifTC = Noto_Serif_TC({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto-tc",
});

export default function RootLayout({ children }) {
  return (
    <html
      lang="zh"
      suppressHydrationWarning
      className={`${manrope.variable} ${alumni.variable} ${notoSerifTC.variable}`}
    >
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
