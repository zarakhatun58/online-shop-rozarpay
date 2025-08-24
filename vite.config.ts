import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(() => ({
  server: {
    host: "::",
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://online-shop-server-hy92.onrender.com',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          // Set COOP/COEP headers for dev
          proxy.on('proxyRes', (proxyRes, req, res) => {
            res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
            res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
          });
        },
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), 
    },
  },
}));
