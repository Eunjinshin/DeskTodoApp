const { defineConfig } = require('vite')
const react = require('@vitejs/plugin-react').default

module.exports = defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    strictPort: true,
  },
})
