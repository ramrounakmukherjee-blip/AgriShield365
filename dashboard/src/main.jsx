import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LangProvider } from './lib/useLang.jsx'

// Build marker — confirms exactly which version is live (F12 -> Console).
try {
  // eslint-disable-next-line no-undef
  console.log(`%cAgriShield 365%c build ${__BUILD__} · ${__BUILD_DATE__}`,
    'background:#047857;color:#fff;padding:2px 6px;border-radius:4px;font-weight:bold',
    'color:#047857;padding:2px 6px;')
} catch { /* noop */ }

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LangProvider>
      <App />
    </LangProvider>
  </StrictMode>,
)
