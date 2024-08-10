// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  optimizeDeps: {
    include: ["@emotion/react", "@emotion/styled", "@mui/material/Tooltip"],
  },
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
  ],
  css: {
    preprocessorOptions: {
      css: {
        additionalData: '@import "tailwindcss/tailwind";',
      },
    },
  },
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
});
