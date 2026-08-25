import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Solarized Light Core Palette
        background: "#fdf6e3",
        "on-background": "#071e25",
        surface: "#f2fbff",
        "surface-dim": "#eee8d5",
        "surface-bright": "#f2fbff",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#e3f7ff",
        "surface-container": "#daf2fb",
        "surface-container-high": "#d5ecf5",
        "surface-container-highest": "#cfe6ef",
        "on-surface": "#071e25",
        "on-surface-variant": "#404751",
        "inverse-surface": "#1e333a",
        "inverse-on-surface": "#ddf5fe",
        
        outline: "#707882",
        "outline-variant": "#bfc7d2",
        "surface-tint": "#00639b",
        
        primary: "#006098",
        "on-primary": "#ffffff",
        "primary-container": "#007abe",
        "on-primary-container": "#fdfcff",
        "primary-fixed": "#cee5ff",
        "primary-fixed-dim": "#97cbff",
        "on-primary-fixed": "#001d33",
        "on-primary-fixed-variant": "#004a76",
        
        secondary: "#006a64",
        "on-secondary": "#ffffff",
        "secondary-container": "#89f5ea",
        "on-secondary-container": "#00716a",
        "secondary-fixed": "#89f5ea",
        "secondary-fixed-dim": "#6cd8ce",
        "on-secondary-fixed": "#00201e",
        "on-secondary-fixed-variant": "#00504b",
        
        tertiary: "#556200",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#6c7c00",
        "on-tertiary-container": "#fdffe0",
        "tertiary-fixed": "#d7ee5e",
        "tertiary-fixed-dim": "#bbd144",
        "on-tertiary-fixed": "#191e00",
        "on-tertiary-fixed-variant": "#414c00",
        
        // Solarized Semantic Status Accents
        emphasis: "#586e75",
        warning: "#b58900",
        "warning-amber": "#b58900",
        danger: "#dc322f",
        "red-flag": "#dc322f",
        "success-green": "#859900",
        "statutory-blue": "#006098",
        
        // Glassmorphism surfaces
        "glass-surface": "rgba(238, 232, 213, 0.75)",
        "glass-surface-solid": "rgba(238, 232, 213, 0.92)",
        "glass-border": "rgba(101, 123, 131, 0.2)",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
        full: "9999px",
      },
      spacing: {
        unit: "4px",
        gutter: "24px",
        "margin-page": "40px",
        sidebar: "280px",
        "container-max": "1440px",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        "label-caps": ["JetBrains Mono", "monospace"],
        "data-mono": ["JetBrains Mono", "monospace"],
      },
      backdropBlur: {
        xs: "2px",
        xl: "20px",
        "2xl": "40px",
      },
    },
  },
  plugins: [],
};

export default config;
