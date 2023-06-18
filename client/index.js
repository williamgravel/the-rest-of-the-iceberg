// PACKAGE IMPORTS
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './src/App'

// RENDER APP
const container = document.getElementById('root')
const root = createRoot(container)
root.render(<App />)
