import { defineConfig } from 'tsup'

import { copyFileSync, existsSync, mkdirSync } from 'fs'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: 'terser',
  treeshake: true,
  external: ['react'],
  esbuildOptions(options) {
    options.resolveExtensions = ['.ts', '.tsx', '.js', '.jsx']
    options.loader = {
      ...options.loader,
      '.scss': 'file',
      '.css': 'file',
    }
  },
  async onSuccess() {
    if (!existsSync('./dist')) {
      mkdirSync('./dist', { recursive: true })
    }
    copyFileSync('./src/theme.css', './dist/theme.css')
  },
})
