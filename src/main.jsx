import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { router } from './routes/router';
import { RouterProvider } from 'react-router';
import { Toaster } from 'react-hot-toast';
import AuthProvider from './contexts/AuthContext/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster position="top-center" reverseOrder={false} />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);
