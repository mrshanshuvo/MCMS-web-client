import { Outlet } from "react-router";
import CareCampLogo from "../pages/Shared/CareCampLogo/CareCampLogo";

const AuthLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#F5F7F8] to-white">
      {/* Header with Logo */}
      <header className="px-6 py-4 bg-white shadow-sm border-b border-[#495E57]/10">
        <CareCampLogo />
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-[#495E57]/10">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-[#45474B]/70 bg-white border-t border-[#495E57]/10">
        &copy; {new Date().getFullYear()} CareCamp. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthLayout;
