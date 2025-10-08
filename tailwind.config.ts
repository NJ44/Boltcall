import type { Config } from 'tailwindcss'
// @ts-ignore
import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#2563EB",
          blueDark: "#1E40AF",
          sky: "#93C5FD",
        },
        text: {
          main: "#0B1220",
          muted: "#475569",
        },
        bg: "#FFFFFF",
        "white-smoke": "#F5F5F5",
        "light-blue": "#DDE2EE",
        border: "#E5E7EB",
      },
      animation: {
        aurora: "aurora 60s linear infinite",
        spotlight: "spotlight 2s ease .75s 1 forwards",
      },
      keyframes: {
        aurora: {
          from: {
            backgroundPosition: "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition: "350% 50%, 350% 50%",
          },
        },
        spotlight: {
          "0%": {
            opacity: "0",
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: "1",
            transform: "translate(-50%,-40%) scale(1)",
          },
        },
      },
    }
  },
  plugins: [addVariablesForColors],
}

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}

export default config
