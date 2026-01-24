import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),],
  /* Fixes index.html loading relative path */
  base: "./",
  /* Where we output the vue build */
  build: {
    outDir: "dist-ui",
  },
  server: {
    port: 5123,
    /* Will only work if the above port is open */
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  }
});
