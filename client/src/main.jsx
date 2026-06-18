import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './services/AuthContext';
import { TooltipProvider } from './components/ui/tooltip';

document.documentElement.classList.add("dark")

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <TooltipProvider>
        <App />
      </TooltipProvider>
    </AuthProvider>
  </StrictMode>,
)
