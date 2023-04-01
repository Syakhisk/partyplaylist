import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import eslint from "vite-plugin-eslint"
import * as path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint({ useEslintrc: true })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
})
