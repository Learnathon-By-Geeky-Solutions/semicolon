import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.tsx'
import { DisasterProvider } from './providers/DisasterContextProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <DisasterProvider>
        <App />
      </DisasterProvider>
    </BrowserRouter>
  </StrictMode>,
)
