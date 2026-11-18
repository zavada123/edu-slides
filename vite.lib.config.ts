import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// The package build: two ES entries and one CSS file in lib/. The demo build (vite.config.ts) goes to dist/.
// React and Konva stay outside: the page that uses the package installs them once and bundles them itself.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "lib",
    emptyOutDir: true,
    minify: false,
    // The pictures of the library are small SVG files: inline them so the package has no loose assets.
    assetsInlineLimit: 64 * 1024,
    lib: {
      entry: { core: "src/core.ts", react: "src/react.ts" },
      formats: ["es"],
      cssFileName: "style"
    },
    rollupOptions: {
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^konva($|\/)/, /^react-konva($|\/)/]
    }
  }
})
