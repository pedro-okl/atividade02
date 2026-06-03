import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { DiscoveriesProvider } from './context/DiscoveriesContext.tsx'
import { ToastProvider } from './context/ToastContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <ToastProvider>
        <DiscoveriesProvider>
          <App />
        </DiscoveriesProvider>
      </ToastProvider>
    </HashRouter>
  </StrictMode>,
)
