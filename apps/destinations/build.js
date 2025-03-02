/* eslint-disable @typescript-eslint/no-require-imports, no-undef */
const esbuild = require('esbuild')

const fs = require('fs')
const path = require('path')

// Make sure dist directory exists
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true })
}

// Copy the data files
if (fs.existsSync('src/data')) {
  if (!fs.existsSync('dist/data')) {
    fs.mkdirSync('dist/data', { recursive: true })
  }

  const dataFiles = fs.readdirSync('src/data')
  dataFiles.forEach((file) => {
    fs.copyFileSync(path.join('src/data', file), path.join('dist/data', file))
  })
}

// Bundle the code
esbuild
  .build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    outfile: 'dist/index.js',
    format: 'esm',
    platform: 'browser',
    target: ['es2020'],
    minify: true,
    // Include React and all dependencies in the bundle for isolation
    // This creates a fully self-contained web component
    external: [], // No externals - bundle everything
    loader: {
      '.json': 'json',
    },
    define: {
      'process.env.NODE_ENV': '"production"',
      // Handle globals safely
      global: 'globalThis',
    },
    // Make sure our patches get injected first, before any other code runs
    inject: ['./src/utils/worker-patch.js', './react-shim.js'],
    banner: {
      js: `
      // Ensure global objects exist in any environment
      (function() {
        const global = globalThis;
        if (typeof window === 'undefined') {
          global.window = global;
        }
        if (!global.document) {
          global.document = {
            createElement: () => ({}),
            createElementNS: () => ({}),
            head: { appendChild: () => {} },
            body: { appendChild: () => {} }
          };
        }
      })();
    `,
    },
  })
  .catch((err) => {
    console.error('Build failed:', err)
    process.exit(1)
  })
