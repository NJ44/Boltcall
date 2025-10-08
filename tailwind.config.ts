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
