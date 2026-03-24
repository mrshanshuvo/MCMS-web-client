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
        className={`fixed inset-y-0 left-0 lg:relative z-50 w-64 h-full bg-gradient-to-b from-[#1e3a8a] to-[#0f766e] text-white p-5 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Close button for mobile */}
        <button
          className="absolute top-4 right-4 lg:hidden p-2 text-white/70 hover:text-white rounded-md hover:bg-white/10"
          onClick={() => setIsOpen(false)}
        >
          <X size={20} />
        </button>

        {/* Logo linking to Home */}
        <div className="mb-8 pt-2">
          <Link
            to="/"
            className="flex items-center gap-1 group px-2"
            onClick={() => setIsOpen(false)}
          >
            <img src={logo} className="w-14 h-14" alt="CareCamp Logo" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-teal-200">
              CareCamp
            </span>
          </Link>
        </div>

        {/* Navigation links */}
        <nav className="space-y-2 flex-1 overflow-y-auto pr-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group ${isActive
                  ? isOrganizer
                    ? "bg-blue-500/10 backdrop-blur-sm border border-blue-400/20 shadow-lg"
                    : "bg-teal-500/10 backdrop-blur-sm border border-teal-400/20 shadow-lg"
                  : "hover:bg-white/5 hover:border-white/10"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`mr-3 ${isActive
                      ? isOrganizer
                        ? "text-blue-300"
                        : "text-teal-300"
                      : "text-gray-300 group-hover:text-white"
                      }`}
                  >
                    {link.icon}
                  </span>
                  <span className={`truncate ${!isActive && "text-gray-200 group-hover:text-white"}`}>{link.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="mt-2 pr-1">
          <button
            onClick={() => {
              setIsOpen(false);
              handleLogOut();
            }}
            className="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group hover:bg-red-500/10 border border-transparent hover:border-red-400/20 text-gray-300 hover:text-red-400 cursor-pointer"
          >
            <span className="mr-3 text-red-400/80 group-hover:text-red-400 transition-colors">
              <LogOut size={18} />
            </span>
            <span className="truncate transition-colors">Sign Out</span>
          </button>
        </div>

        {/* Footer */}
        <div
          className={`mt-6 pt-4 border-t ${isOrganizer ? "border-blue-400/20" : "border-teal-400/20"
            } text-xs text-blue-100/60`}
        >
          <p>© {new Date().getFullYear()} CareCamp</p>
          <p className="mt-1">All rights reserved.</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
