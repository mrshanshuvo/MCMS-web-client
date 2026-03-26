import { Menu, User as UserIcon } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useUserRole from "../../hooks/useUserRole";

const TopBar = ({ setIsSidebarOpen }) => {
  const { user } = useAuth();
  const { role } = useUserRole();
  const isOrganizer = role === "organizer";

  return (
    <header className="bg-white border-b border-gray-100 z-30 flex items-center justify-between px-4 sm:px-6 h-16 shrink-0">
      <div className="flex items-center">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-2 -ml-2 mr-2 text-gray-500 hover:text-[#ff1e00] hover:bg-[#e8f9fd] rounded-lg transition-all duration-200 cursor-pointer focus:outline-none"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
          {isOrganizer ? (
            <>
              Organizer <span className="text-[#ff1e00]">Dashboard</span>
            </>
          ) : (
            <>
              Participant <span className="text-[#ff1e00]">Portal</span>
            </>
          )}
        </h1>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <div className="flex flex-col items-end">
          <span className="text-sm font-semibold text-gray-900">{user?.displayName || "User"}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full mt-0.5 ${role === "organizer"
              ? "bg-[#ff1e00]/10 text-[#ff1e00]"
              : "bg-[#59ce8f]/10 text-[#59ce8f]"
            }`}>
            {role === "organizer" ? "Organizer" : "Participant"}
          </span>
        </div>
        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 p-[2px] shadow-sm">
          {user?.photoURL ? (
            <img
              src={user?.photoURL}
              alt={user?.displayName || "User"}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-[#e8f9fd] flex items-center justify-center">
              <UserIcon size={18} className="text-[#ff1e00]" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;