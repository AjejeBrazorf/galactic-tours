// This file is injected by esbuild to ensure React is available globally
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as ReactDOMClient from 'react-dom/client'

// Make React available globally
window.React = React
window.ReactDOM = ReactDOM
window.ReactDOMClient = ReactDOMClient 