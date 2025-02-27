
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Route, Router } from 'wouter'
import App from './App'
import './index.css'
import { Toaster } from './components/ui/toaster'

// Create a client for React Query
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <App />
        <Toaster />
      </Router>
    </QueryClientProvider>
  </React.StrictMode>,
)
