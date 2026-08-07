import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

const ErrorBoundaryFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center space-y-5">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
          <AlertTriangle size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Something went wrong</h2>
          <p className="text-sm text-gray-500 mt-2">
            An unexpected error occurred in the application interface.
          </p>
          {error?.message && (
            <p className="text-xs font-mono bg-gray-100 p-2.5 rounded-lg text-red-600 mt-3 text-left overflow-x-auto">
              {error.message}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={resetErrorBoundary}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#495E57] hover:bg-[#45474B] text-white font-semibold rounded-xl transition-all shadow-md"
        >
          <RefreshCw size={18} />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
};

export default ErrorBoundaryFallback;
