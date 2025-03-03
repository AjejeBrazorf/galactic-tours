// @ts-check
import react from '@vitejs/plugin-react'
import fs from 'fs-extra'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

import { resolve } from 'path'

// Custom plugin to copy theme.css to the root of dist
const copyThemeCSS = () => {
  return {
    name: 'copy-theme-css',
    closeBundle: async () => {
      // Copy from ui.css to theme.css
      await fs.copy(
        resolve(__dirname, 'dist/ui.css'),
        resolve(__dirname, 'dist/theme.css')
      )

      // Add a note in the ThemeProvider directory to help developers
      await fs.writeFile(
        resolve(__dirname, 'dist/ThemeProvider/README.md'),
        '# ThemeProvider\n\nImportant: When using ThemeProvider, you should also import the CSS file:\n\n```js\nimport { ThemeProvider } from "@galactic-tours/ui/theme";\nimport "@galactic-tours/ui/theme.css";\n```\n'
      )
    },
  }
}

export default defineConfig({
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
    preprocessorOptions: {
      scss: {
        api: 'modern',
      },
    },
  },
  optimizeDeps: {
    include: ['**/*.scss', '**/*.css'],
  },
  plugins: [
    react(),
    dts({
      include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.css'],
      exclude: ['src/**/*.stories.tsx'],
    }),
    copyThemeCSS(),
  ],
  build: {
    // Ensure CSS is extracted to a single file
    cssCodeSplit: false,
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        theme: resolve(__dirname, 'src/theme.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) =>
        `${entryName}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
  },
})
