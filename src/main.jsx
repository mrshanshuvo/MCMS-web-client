import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router';
import { router } from './routes/router';
import AuthProvider from './contexts/AuthContext/AuthProvider';
import { ThemeProvider } from './contexts/ThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorBoundaryFallback from './components/Common/ErrorBoundaryFallback';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
      <HelmetProvider>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <RouterProvider router={router} />
            </AuthProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
