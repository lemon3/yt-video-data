/* global __dirname */
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  build: {
    target: 'es2015', // esnext
    outDir: resolve(__dirname, './demo'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, './index.html'),
      },
    },
  },

  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, 'src'),
      },
    ],
  },
});
