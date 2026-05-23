import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

if (!window.storage) {
  window.storage = {
    get: async (key) => ({ value: localStorage.getItem(key) }),
    set: async (key, value) => { localStorage.setItem(key, value) },
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
