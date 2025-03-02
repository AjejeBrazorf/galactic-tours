import react from '@vitejs/plugin-react'
import path, { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) =>
        `${entryName}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react-reconciler',
        'scheduler',
        'use-sync-external-store',
        'use-sync-external-store/shim',
        'use-sync-external-store/shim/with-selector',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          'react-reconciler': 'ReactReconciler',
          scheduler: 'Scheduler',
          'use-sync-external-store': 'UseSyncExternalStore',
          'use-sync-external-store/shim': 'UseSyncExternalStoreShim',
          'use-sync-external-store/shim/with-selector': 'WithSelector',
        },
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
  },
})
