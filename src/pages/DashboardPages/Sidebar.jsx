import { NavLink, Link, useNavigate } from "react-router";
import {
  LayoutDashboard,
  PlusCircle,
  Settings,
  ClipboardList,
  User,
  CalendarCheck,
  ChartBar,
  CreditCard,
  User2,
  X,
  LogOut,
  ChevronRight,
} from "lucide-react";
import useUserRole from "../../hooks/useUserRole";
import useAuth from "../../hooks/useAuth";
import logo from "/care-camp.png"

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { role } = useUserRole();
  const { logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const isOrganizer = role === "organizer";

  // Common links for both roles
  const commonLinks = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      end: true,
    },
  ];

  // Organizer-specific links
  const organizerLinks = [
    {
      to: "/dashboard/add-camp",
      label: "Add New Camp",
      icon: <PlusCircle size={18} />,
    },
    {
      to: "/dashboard/organizer-profile",
      label: "Organizer Profile",
      icon: <User2 size={18} />,
    },
    {
      to: "/dashboard/manage-camps",
      label: "Manage Camps",
      icon: <Settings size={18} />,
    },
    {
      to: "/dashboard/manage-registrations",
      label: "Manage Registrations",
      icon: <ClipboardList size={18} />,
    },
  ];

  // Participant-specific links
  const participantLinks = [
    {
      to: "/dashboard/analytics",
      label: "Analytics",
      icon: <ChartBar size={18} />,
    },
    {
      to: "/dashboard/profile",
      label: "Participant Profile",
      icon: <User size={18} />,
    },
    {
      to: "/dashboard/registered-camps",
      label: "Registered Camps",
      icon: <CalendarCheck size={18} />,
    },
    {
      to: "/dashboard/payment-history",
      label: "Payment History",
      icon: <CreditCard size={18} />,
    },
  ];

  // Combine links based on role
  const links = [
    ...commonLinks,
    ...(isOrganizer ? organizerLinks : participantLinks),
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 lg:relative z-50 w-64 h-full bg-white border-r border-gray-100 p-5 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Close button for mobile */}
        <button
          className="absolute top-4 right-4 lg:hidden p-2 text-gray-500 hover:text-[#ff1e00] rounded-md hover:bg-[#e8f9fd] transition-all duration-200"
          onClick={() => setIsOpen(false)}
        >
          <X size={20} />
        </button>

        {/* Logo linking to Home */}
        <div className="mb-8 pt-2">
          <Link
            to="/"
            className="flex items-center gap-2 group cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <div className="relative">
              <img src={logo} className="w-12 h-12" alt="CareCamp Logo" />
            </div>
            <span className="text-xl font-bold text-gray-900 group-hover:text-[#ff1e00] transition-colors">
              CareCamp
            </span>
          </Link>
        </div>

        {/* Navigation links */}
        <nav className="space-y-1 flex-1 overflow-y-auto pr-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group cursor-pointer ${isActive
                  ? "bg-[#ff1e00] text-white shadow-sm"
                  : "text-gray-600 hover:bg-[#e8f9fd] hover:text-[#ff1e00]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <span className={isActive ? "text-white" : "text-gray-400 group-hover:text-[#ff1e00]"}>
                      {link.icon}
                    </span>
                    <span className="truncate">{link.label}</span>
                  </div>
                  {isActive && (
                    <ChevronRight size={14} className="text-white/80" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="mt-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => {
              setIsOpen(false);
              handleLogOut();
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group cursor-pointer text-gray-600 hover:bg-[#e8f9fd] hover:text-[#ff1e00]"
          >
            <div className="flex items-center gap-3">
              <span className="text-gray-400 group-hover:text-[#ff1e00] transition-colors">
                <LogOut size={18} />
              </span>
              <span className="truncate">Sign Out</span>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} CareCamp</p>
          <p className="mt-1">All rights reserved.</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;