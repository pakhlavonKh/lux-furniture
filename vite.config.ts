import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Forward API calls to the backend to avoid CORS during local development.
      "/api": {
        target: process.env.VITE_API_URL || "http://localhost:5002",
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            // Backend CORS can reject "http://localhost:8081" if the origin isn't allowlisted.
            // For proxied local calls we intentionally remove Origin so backend treats it as same-site.
            proxyReq.removeHeader("Origin");
            proxyReq.removeHeader("origin");
          });
        },
      },
      "/uploads": {
        target: process.env.VITE_API_URL || "http://localhost:5002",
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.removeHeader("Origin");
            proxyReq.removeHeader("origin");
          });
        },
      },
    },
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
