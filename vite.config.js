import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import vitePluginBundleObfuscator from 'vite-plugin-bundle-obfuscator';

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",  
  plugins: [
    vue(),
    Pages(),
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
