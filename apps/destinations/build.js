const esbuild = require('esbuild')
const { sassPlugin } = require('esbuild-sass-plugin')

esbuild
  .build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    outfile: 'dist/index.js',
    format: 'esm',
    platform: 'browser',
    target: ['es2020'],
    minify: true,
    external: [], // No externals - bundle everything
    loader: {
      '.json': 'json',
      '.scss': 'css',
      '.css': 'css',
    },
    define: {
      'process.env.NODE_ENV': '"production"',
      global: 'globalThis',
    },
    inject: ['./src/utils/worker-patch.js', './react-shim.js'],
    plugins: [
      sassPlugin({
        // Force CSS to be exported as a string that we can inject
        type: 'css-text',
      })
    ],
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
      
      // Inject CSS into the document - this will be used for non-shadow DOM contexts
      (function() {
        if (typeof document !== 'undefined') {
          const style = document.createElement('style');
          style.textContent = \`
            /* Base styles for the web component */
            .destinationLabel {
              font-size: 12px;
              padding: 2px 6px;
              background-color: rgba(0, 0, 0, 0.6);
              color: white;
              border-radius: 4px;
              pointer-events: none;
              white-space: nowrap;
              height: 2.6ch;
              display: flex;
              align-items: center;
              justify-content: center;
              max-width: fit-content;
              position: absolute;
              left: 50%;
              top: 50%;
              translate: -50% -50%;
            }
          \`;
          document.head.appendChild(style);
        }
      })();
    `,
    },
  })
  .then(() => {
    console.log('Build completed successfully!')
  })
  .catch((err) => {
    console.error('Build failed:', err)
    process.exit(1)
  })
