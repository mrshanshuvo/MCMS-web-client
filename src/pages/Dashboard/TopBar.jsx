import { Menu, User as UserIcon } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useUserRole from "../../hooks/useUserRole";

const TopBar = ({ setIsSidebarOpen }) => {
  const { user } = useAuth();
  const { role } = useUserRole();
  const isOrganizer = role === "organizer";

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 z-30 flex items-center justify-between px-4 sm:px-6 h-16 shrink-0">
      <div className="flex items-center">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-2 -ml-2 mr-2 text-gray-600 hover:bg-gray-100 rounded-md focus:outline-none cursor-pointer"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-800 hidden sm:block">
          {isOrganizer ? "Organizer Dashboard" : "Participant Portal"}
        </h1>
      </div>
      
      <div className="flex items-center gap-3 md:gap-4">
        <div className="flex flex-col items-end">
           <span className="text-sm font-bold text-gray-900">{user?.displayName || "User"}</span>
           <span className="text-xs text-gray-500 capitalize px-2 py-0.5 bg-gray-100 rounded-full">{role}</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#1e3a8a] to-[#0f766e] p-[2px] shadow-sm">
           {user?.photoURL ? (
             <img src={user?.photoURL} alt="User" className="w-full h-full rounded-full object-cover border-2 border-white" />
           ) : (
             <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <UserIcon size={20} className="text-[#0f766e]" />
             </div>
           )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
