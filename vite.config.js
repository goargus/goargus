import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import vitePluginBundleObfuscator from 'vite-plugin-bundle-obfuscator';
import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

function emitNotFoundShell() {
  return {
    name: "emit-not-found-shell",
    apply: "build",
    writeBundle(options) {
      const outDir = options.dir ?? "dist";
      const shell = resolve(outDir, "index.html");
      if (!existsSync(shell)) {
        this.error("index.html was not emitted, cannot create 404.html");
      }
      copyFileSync(shell, resolve(outDir, "404.html"));
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",  
  plugins: [
    vue(),
    Pages(),
    emitNotFoundShell(),
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
