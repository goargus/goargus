import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import { viteObfuscateFile } from 'vite-plugin-obfuscator';

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",  
  plugins: [
    vue(),
    Pages(),
    viteObfuscateFile({
      global: true, 
      stringArray: true, 
      transformObjectKeys: true, 
    }),
  ],
  build: {
    outDir: "dist",  
    minify: "terser",
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
