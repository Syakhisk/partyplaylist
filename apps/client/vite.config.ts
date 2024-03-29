import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import eslint from "vite-plugin-eslint"
import * as path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslint({
      useEslintrc: true,
      // Ignore if files in these folders doesn't pass eslint
      exclude: ["**/node_modules/**", "**/dist/**"]
    })
  ],
  optimizeDeps: {
    include: ["schema"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
})
