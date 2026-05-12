import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  optimizeDeps: {
    exclude: ['uview-plus'],
  },
  build: {
    commonjsOptions: {
      include: [/uview-plus/, /node_modules/],
    },
  },
})
