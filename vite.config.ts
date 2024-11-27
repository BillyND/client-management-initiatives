import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { fileURLToPath } from "url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    // Minify bundle
    minify: "terser",
    terserOptions: {
      compress: {
        // drop_console: true, // Remove console.log
        // drop_debugger: true, // Remove debugger statements
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Split large libraries into separate chunks
          vendor: ["react", "react-dom"],
        },
      },
    },
    // Compress assets
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 500,
  },
});
