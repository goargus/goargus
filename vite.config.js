import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { pageRoutes } from './build/pageRoutes.js'
import { withRouteMeta, renderSitemap, notFoundPath } from './src/siteMeta.js'

function routeMetadata() {
  return {
    name: "route-metadata",
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        return withRouteMeta(html, "/");
      },
    },
    writeBundle(options) {
      const outDir = options.dir ?? "dist";
      const shellPath = resolve(outDir, "index.html");
      if (!existsSync(shellPath)) {
        this.error("index.html was not emitted, cannot create the route shells");
      }
      const shell = readFileSync(shellPath, "utf8");

      writeFileSync(resolve(outDir, "404.html"), withRouteMeta(shell, notFoundPath));

      const routes = pageRoutes();
      for (const route of routes) {
        if (route === "/") continue;
        writeFileSync(resolve(outDir, `${route.slice(1)}.html`), withRouteMeta(shell, route));
      }

      writeFileSync(resolve(outDir, "sitemap.xml"), renderSitemap(routes));
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    vue(),
    Pages(),
    routeMetadata(),
  ],
  build: {
    outDir: "dist",
    minify: "terser",
    cssCodeSplit: false,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["vue", "vue-router"],
        },
      },
    },
  },
})
