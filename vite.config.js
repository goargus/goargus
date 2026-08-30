import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import vitePluginBundleObfuscator from 'vite-plugin-bundle-obfuscator';
import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { pageRoutes } from './build/pageRoutes.js'

function emitRouteShells() {
  return {
    name: "emit-route-shells",
    apply: "build",
    writeBundle(options) {
      const outDir = options.dir ?? "dist";
      const shell = resolve(outDir, "index.html");
      if (!existsSync(shell)) {
        this.error("index.html was not emitted, cannot create the route shells");
      }
      copyFileSync(shell, resolve(outDir, "404.html"));
      for (const route of pageRoutes()) {
        if (route === "/") continue;
        copyFileSync(shell, resolve(outDir, `${route.slice(1)}.html`));
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",  
  plugins: [
    vue(),
    Pages(),
    emitRouteShells(),
    vitePluginBundleObfuscator({
      enable: true,
      log: false,
      autoExcludeNodeModules: true,
      options: {
        stringArray: true,
        transformObjectKeys: true,
      }
    }),
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
