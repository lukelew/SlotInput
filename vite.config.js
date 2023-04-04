/*
 * Author  Luke.Lu
 * Date  2023-02-17 16:32:44
 * LastEditors  Luke.Lu
 * LastEditTime  2023-03-31 18:24:26
 * Description
 */
import { defineConfig } from 'vite';
import * as path from 'path';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/')
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `@import '@/assets/styles/vars.less';`,
        javascriptEnabled: true
      }
    }
  },
  server: {
    port: 3105,
    proxy: {
      '/api': {
        target: 'http://10.2.2.32:9990'
      }
    }
  },
  plugins: [react()]
});
