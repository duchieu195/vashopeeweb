import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Clear cart if stored with old format (pre-variant version)
try {
  const raw = localStorage.getItem('vashopeeweb-cart');
  if (raw) {
    const parsed = JSON.parse(raw);
    if (!parsed.state?.version || parsed.state.version < 2) {
      localStorage.removeItem('vashopeeweb-cart');
    }
  }
} catch {
  localStorage.removeItem('vashopeeweb-cart');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
