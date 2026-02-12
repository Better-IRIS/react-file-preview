import react from "@vitejs/plugin-react";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: resolve(
            __dirname,
            "node_modules/pdfjs-dist/build/pdf.worker.min.mjs",
          ),
          dest: "./pdfjs",
        },
        {
          src: resolve(__dirname, "node_modules/pdfjs-dist/cmaps"),
          dest: "./pdfjs",
        },
      ],
    }),
  ],
  publicDir: false,
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "ReactFilePreview",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "mjs" : "cjs"}`,
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "framer-motion",
        "lucide-react",
        "pdfjs-dist",
        "react-pdf",
        "mammoth",
        "docx-preview",
        "pptx-preview",
        "xlsx",
        "react-markdown",
        "remark-gfm",
        "react-syntax-highlighter",
        "@videojs-player/react",
        "video.js",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.names && assetInfo.names[0] === "style.css")
            return "index.css";
          return assetInfo.names?.[0] || "assets/[name]-[hash][extname]";
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
    outDir: "lib",
  },
  optimizeDeps: {
    exclude: ["pdfjs-dist"],
  },
});
