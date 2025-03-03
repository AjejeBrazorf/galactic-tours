import path from 'path'
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  tsconfig: path.resolve(__dirname, 'tsconfig.json'),
  external: ['react'],
  esbuildOptions(options) {
    options.jsx = 'automatic'
  },
  treeshake: true,
})
