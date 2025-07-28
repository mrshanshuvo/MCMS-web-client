import { Outlet } from 'react-router';
import MCMSLogo from '../pages/Shared/MCMSLogo/MCMSLogo';

const AuthLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header with Logo */}
      <header className="px-6 py-4 bg-white shadow-sm">
        <MCMSLogo />
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-gray-500 bg-white">
        &copy; {new Date().getFullYear()} MCMS. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthLayout;