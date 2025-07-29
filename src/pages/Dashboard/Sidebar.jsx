import { NavLink } from "react-router";

const Sidebar = () => {
  const links = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dashboard Home" },
    { to: "/dashboard/add-camp", label: "Add New Camp" },
    { to: "/dashboard/manage-camps", label: "Manage Camps" },
    { to: "/dashboard/manage-registrations", label: "Manage Registrations" },
    { to: "/dashboard/feedbacks", label: "User Feedback" },
  ];

  return (
    <aside className="w-64 bg-blue-800 text-white p-5 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Organizer Panel</h2>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `block px-3 py-2 rounded hover:bg-blue-600 ${
              isActive ? "bg-blue-700" : ""
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </aside>
  );
};

export default Sidebar;
