import type { Config } from "tailwindcss";

export default {
  content: [], // Apps will override this
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6", // One color for both Web & Mobile
        secondary: "#1e293b",
      },
    },
  },
} satisfies Config;
