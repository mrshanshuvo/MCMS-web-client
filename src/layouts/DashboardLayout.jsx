import { useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "../pages/Dashboard/Sidebar";
import TopBar from "../pages/Dashboard/TopBar";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full relative">
        <TopBar setIsSidebarOpen={setIsSidebarOpen} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-gray-50">
           <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
