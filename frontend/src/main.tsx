import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.tsx'
import { DisasterProvider } from './providers/DisasterContextProvider';

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found');
  throw new Error('Root element not found');
}
createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <DisasterProvider>
        <App />
      </DisasterProvider>
    </BrowserRouter>
  </StrictMode>,
)
