import React, { useState, useContext, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router";
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { AuthContext } from "../../../contexts/AuthContext/AuthContext";
import MCMSLogo from "../MCMSLogo/MCMSLogo";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/available-camps", label: "Available Camps" },
    { path: "/success-stories", label: "Success Stories" },
    { path: "/about", label: "About Us" }
  ];

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Close dropdown/menu if click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest('button[aria-label="Toggle Menu"]')) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-gradient-to-r from-[#1e3a8a] via-[#3A7CA5] to-[#0f766e] text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-2 group"
          onClick={() => setIsOpen(false)}
        >
          <MCMSLogo className="group-hover:scale-110 transition-transform" />
          <span className="font-bold text-xl bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            MCMS
          </span>
        </NavLink>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex gap-6 items-center">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `px-1 py-2 font-medium transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-300 hover:after:w-full after:transition-all ${isActive
                      ? "text-yellow-300 after:w-full"
                      : "text-white hover:text-yellow-200"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {!user ? (
            <NavLink
              to="/login"
              className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-5 py-2 rounded-lg font-semibold shadow-md hover:shadow-yellow-300/30 transition-all flex items-center gap-2"
            >
              Join Us
              <User size={18} />
            </NavLink>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <img
                  src={user.photoURL || "/default-avatar.png"}
                  alt={user.displayName || "User"}
                  className="w-10 h-10 rounded-full border-2 border-white/30 group-hover:border-yellow-300 transition-all shadow-md"
                  title={user.displayName}
                />
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 shadow-xl rounded-lg overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-gray-50">
                    <p className="font-semibold truncate">{user.displayName}</p>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>

                  <NavLink
                    to="/dashboard"
                    className="flex items-center gap-2 px-4 py-3 hover:bg-yellow-50 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <LayoutDashboard size={16} className="text-blue-600" />
                    Dashboard
                  </NavLink>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-3 hover:bg-red-50 transition-colors border-t border-gray-100"
                  >
                    <LogOut size={16} className="text-red-500" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden bg-gradient-to-b from-blue-900/95 to-teal-900/95 backdrop-blur-sm px-4 py-6 absolute w-full z-40 shadow-xl"
        >
          <ul className="space-y-4">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg font-medium transition-colors ${isActive
                      ? "bg-white/10 text-yellow-300"
                      : "text-white hover:bg-white/10 hover:text-yellow-200"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}

            {user ? (
              <>
                <li className="px-3 py-2 text-sm text-white/80 border-t border-white/10 mt-4">
                  Logged in as {user.displayName || user.email}
                </li>
                <li>
                  <NavLink
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:bg-white/10"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-300 hover:bg-red-900/20"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="mt-4">
                <NavLink
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-4 py-2 rounded-lg font-semibold shadow-md"
                >
                  Join Us
                  <User size={18} />
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default React.memo(Navbar);