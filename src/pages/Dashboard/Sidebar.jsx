import { NavLink } from "react-router";
import {
  Home,
  LayoutDashboard,
  PlusCircle,
  Settings,
  ClipboardList,
  MessageSquare,
  Stethoscope,
  User,
  CalendarCheck,
  HeartPulse,
  ClipboardCheck,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useUserRole from "../../hooks/useUserRole";
const Sidebar = () => {
  const { user } = useAuth();
  const { role } = useUserRole();
  const isOrganizer = role === "organizer";

  // Common links for both roles
  const commonLinks = [
    { to: "/", label: "Home", icon: <Home size={18} /> },
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
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
      to: "/dashboard/manage-camps",
      label: "Manage Camps",
      icon: <Settings size={18} />,
    },
    {
      to: "/dashboard/manage-registrations",
      label: "Manage Registrations",
      icon: <ClipboardList size={18} />,
    },
    {
      to: "/dashboard/feedbacks",
      label: "User Feedback",
      icon: <MessageSquare size={18} />,
    },
  ];

  // Participant-specific links
  const participantLinks = [
    {
      to: "/dashboard/available-camps",
      label: "Available Camps",
      icon: <Stethoscope size={18} />,
    },
    {
      to: "/dashboard/my-registrations",
      label: "My Registrations",
      icon: <CalendarCheck size={18} />,
    },
    {
      to: "/dashboard/medical-history",
      label: "Medical History",
      icon: <HeartPulse size={18} />,
    },
    {
      to: "/dashboard/feedback",
      label: "Give Feedback",
      icon: <ClipboardCheck size={18} />,
    },
  ];

  // Combine links based on role
  const links = [
    ...commonLinks,
    ...(isOrganizer ? organizerLinks : participantLinks),
  ];

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-[#1e3a8a] to-[#0f766e] text-white p-5 flex flex-col">
      {/* Header with role badge */}
      <div className="mb-8 pt-4">
        <div
          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-3 ${
            isOrganizer
              ? "bg-blue-100/10 backdrop-blur-sm border border-blue-300/20"
              : "bg-teal-100/10 backdrop-blur-sm border border-teal-300/20"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full mr-2 animate-pulse ${
              isOrganizer ? "bg-blue-400" : "bg-teal-400"
            }`}
          ></div>
          {isOrganizer ? "Organizer Dashboard" : "Participant Portal"}
        </div>

        <div className="flex items-center">
          <div
            className={`p-2 rounded-lg mr-3 ${
              isOrganizer
                ? "bg-blue-500/20 border border-blue-400/30"
                : "bg-teal-500/20 border border-teal-400/30"
            }`}
          >
            {isOrganizer ? (
              <Settings size={20} className="text-blue-300" />
            ) : (
              <User size={20} className="text-teal-300" />
            )}
          </div>
          <h2 className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-blue-300 to-teal-300 bg-clip-text text-transparent">
              {user?.displayName || "User"}
            </span>
          </h2>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="space-y-2 flex-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group ${
                isActive
                  ? isOrganizer
                    ? "bg-blue-500/10 backdrop-blur-sm border border-blue-400/20 shadow-lg"
                    : "bg-teal-500/10 backdrop-blur-sm border border-teal-400/20 shadow-lg"
                  : "hover:bg-white/5 hover:border-white/10 hover:shadow-md"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`mr-3 ${
                    isActive
                      ? isOrganizer
                        ? "text-blue-300"
                        : "text-teal-300"
                      : "text-gray-300"
                  }`}
                >
                  {link.icon}
                </span>
                <span>{link.label}</span>
                <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 ${
                      isOrganizer ? "text-blue-300/50" : "text-teal-300/50"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div
        className={`mt-auto pt-4 border-t ${
          isOrganizer ? "border-blue-400/10" : "border-teal-400/10"
        } text-xs text-white/50`}
      >
        <p>MCMS v1.0.0</p>
        <p>Logged in as: {isOrganizer ? "Organizer" : "Participant"}</p>
      </div>
    </aside>
  );
};

export default Sidebar;
