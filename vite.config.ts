import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";
  const backendUrl = isProduction
    ? "https://review-rating-1-qky5.onrender.com"
    : "http://localhost:3002";

  return {
    server: {
      host: "::",
      port: 8080,
      proxy: {
        "/api": {
          target: backendUrl,
          changeOrigin: true,
        },
        "/uploads": {
          target: backendUrl,
          changeOrigin: true,
        },
      },
    },
    define: {
      __APP_BACKEND__: JSON.stringify(backendUrl),
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
