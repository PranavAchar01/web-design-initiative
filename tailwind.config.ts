import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // WDI Design System Colors
        'primary-dark': '#0A0F1E',
        'primary-blue': '#2563EB',
        'primary-cyan': '#06B6D4',
        'gray-50': '#F9FAFB',
        'gray-200': '#E5E7EB',
        'gray-400': '#9CA3AF',
        'gray-700': '#374151',
        'gray-800': '#1F2937',
        'gray-900': '#111827',
        'accent-green': '#10B981',
        'accent-red': '#EF4444',
        'accent-amber': '#F59E0B',
        // Terminal/Command-line Colors
        'terminal-cyan': '#32B8C6',
        'terminal-cyan-muted': '#5FA8B3',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
