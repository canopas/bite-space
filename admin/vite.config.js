import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "./app/page.tsx"),
      name: "bite-space-admin",
      fileName: "index",
    },
    rollupOptions: {
      external: ["react"],
    },
  },
});
