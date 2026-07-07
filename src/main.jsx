import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Import ReactLenis
import { ReactLenis } from 'lenis/react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Bungkus komponen App dengan ReactLenis dan tambahkan prop 'root' */}
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2 }}>
      <App />
    </ReactLenis>
  </StrictMode>,
)