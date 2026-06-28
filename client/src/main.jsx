import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext';
import { TooltipProvider } from './components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

document.documentElement.classList.add("dark")

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <TooltipProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </TooltipProvider>
    </AuthProvider>
  </StrictMode>,
)
