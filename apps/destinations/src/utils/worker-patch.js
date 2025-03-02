// This file provides mock implementations for browser objects in worker environments
// It addresses the "window is not defined" error in Web Workers

// Immediately execute to patch the environment
;(function patchWorkerEnvironment() {
  // Determine the global object in the current context
  const getGlobal = function () {
    if (typeof globalThis !== 'undefined') return globalThis
    if (typeof self !== 'undefined') return self
    if (typeof window !== 'undefined') return window
    if (typeof global !== 'undefined') return global
    return {}
  }

  const global = getGlobal()

  // Make all globals consistent
  if (typeof window === 'undefined') {
    global.window = global

    // Special handler for workers - check if we're in a worker context safely
    if (
      typeof self !== 'undefined' &&
      typeof window === 'undefined' &&
      typeof importScripts === 'function'
    ) {
      console.debug('Running in a worker context, patching environment')
    }
  }

  // Ensure all critical browser APIs exist

  // Document
  if (!global.document) {
    global.document = {
      // Basic DOM operations
      createElement: (tag) => {
        return {
          nodeName: tag,
          tagName: tag,
          style: {},
          setAttribute: () => {},
          getAttribute: () => null,
          addEventListener: () => {},
          removeEventListener: () => {},
          appendChild: () => {},
          removeChild: () => {},
          cloneNode: () => ({}),
          children: [],
        }
      },
      createElementNS: (ns, tag) => {
        return global.document.createElement(tag)
      },
      createTextNode: (text) => ({ nodeValue: text }),

      // Document structure
      head: { appendChild: () => {}, removeChild: () => {} },
      body: {
        appendChild: () => {},
        removeChild: () => {},
        style: { cursor: 'auto' },
      },
      documentElement: {
        clientWidth: 800,
        clientHeight: 600,
        style: {},
      },

      // Event handling
      addEventListener: () => {},
      removeEventListener: () => {},

      // DOM queries
      querySelector: () => null,
      querySelectorAll: () => [],
      getElementById: () => null,

      // For Three.js WebGL detection
      createEvent: () => ({
        initEvent: () => {},
      }),
    }

    console.debug('Patched missing document')
  }

  // Canvas and WebGL context for Three.js
  if (!global.HTMLCanvasElement) {
    global.HTMLCanvasElement = function () {}
    global.HTMLCanvasElement.prototype.getContext = function () {
      return {
        drawArrays: () => {},
        createShader: () => {},
        createBuffer: () => {},
        createTexture: () => {},
        viewport: () => {},
        clearColor: () => {},
        clear: () => {},
      }
    }
    console.debug('Patched HTMLCanvasElement for WebGL')
  }

  // Performance API
  if (!global.performance) {
    global.performance = {
      now: () => Date.now(),
      mark: () => {},
      measure: () => {},
      getEntriesByName: () => [],
    }
  }

  // Animation
  if (!global.requestAnimationFrame) {
    global.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 16)
    global.cancelAnimationFrame = (id) => clearTimeout(id)
  }

  // URL handling
  if (typeof URL !== 'undefined') {
    if (!URL.createObjectURL) {
      URL.createObjectURL = () => ''
    }
    if (!URL.revokeObjectURL) {
      URL.revokeObjectURL = () => {}
    }
  }

  // Navigator
  if (!global.navigator) {
    global.navigator = {
      userAgent: 'WorkerEnvironment',
      language: 'en',
      // WebGL detection uses this
      getGamepads: () => [],
      // For feature detection
      maxTouchPoints: 0,
    }
  }

  // Event constructors used by Three.js
  if (!global.MouseEvent) {
    global.MouseEvent = function () {}
    global.TouchEvent = function () {}
    global.KeyboardEvent = function () {}
    global.Event = function () {
      this.preventDefault = () => {}
      this.stopPropagation = () => {}
    }
  }

  // Blob and Image constructors (used in textures)
  if (!global.Blob) {
    global.Blob = function () {}
  }

  if (!global.Image) {
    global.Image = function () {
      this.addEventListener = () => {}
      this.removeEventListener = () => {}
      this.src = ''
      this.width = 0
      this.height = 0
    }
  }

  // XMLHttpRequest for loading assets
  if (!global.XMLHttpRequest) {
    global.XMLHttpRequest = function () {
      this.open = () => {}
      this.send = () => {}
      this.addEventListener = () => {}
      this.setRequestHeader = () => {}
    }
  }

  console.debug('Worker environment fully patched for 3D rendering')
})()

// Export a dummy value to make it importable
export default 'worker-patch-applied'
