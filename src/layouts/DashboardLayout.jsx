import { Outlet } from "react-router";
import Sidebar from "../pages/Dashboard/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-4 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
