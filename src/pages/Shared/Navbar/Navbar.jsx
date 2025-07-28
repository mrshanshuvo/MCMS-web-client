import React, { useState, useContext, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router";
import { Menu, X } from "lucide-react";
import { AuthContext } from "../../../contexts/AuthContext/AuthContext";
import MCMSLogo from "../MCMSLogo/MCMSLogo";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/available-camps", label: "Available Camps" },
  ];

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Close dropdown if click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <nav className="bg-[#3A7CA5] text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2">
          <MCMSLogo />
          <span className="font-bold text-xl select-none">MCMS</span>
        </NavLink>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  isActive
                    ? "text-yellow-300 font-semibold"
                    : "hover:text-yellow-200 transition"
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}

          {!user ? (
            <li>
              <NavLink
                to="/login"
                className="bg-yellow-400 text-black px-4 py-1 rounded hover:bg-yellow-300 transition"
              >
                Join Us
              </NavLink>
            </li>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <img
                src={user.photoURL}
                alt="User"
                className="w-10 h-10 rounded-full cursor-pointer border-2 border-white shadow-md"
                title={user.displayName}
                onClick={() => setDropdownOpen((prev) => !prev)}
              />
              {dropdownOpen && (
                <ul className="absolute right-0 mt-2 bg-white text-gray-800 shadow-lg rounded-md w-48 z-50">
                  <li className="px-4 py-2 font-semibold border-b">{user.displayName}</li>
                  <li>
                    <NavLink
                      to="/dashboard"
                      className="block px-4 py-2 hover:bg-[#FFC09F] transition rounded"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#FFC09F] transition rounded"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}
        </ul>

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="md:hidden bg-[#2B6CB0] px-4 pb-4 space-y-2 text-white">
          {navLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "block text-yellow-300 font-semibold"
                    : "block hover:text-yellow-200 transition"
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}

          {!user ? (
            <li>
              <NavLink
                to="/login"
                className="block bg-yellow-400 text-black px-4 py-1 rounded hover:bg-yellow-300 transition"
                onClick={() => setIsOpen(false)}
              >
                Join Us
              </NavLink>
            </li>
          ) : (
            <>
              <li className="font-semibold">{user.displayName}</li>
              <li>
                <NavLink to="/dashboard" onClick={() => setIsOpen(false)}>
                  Dashboard
                </NavLink>
              </li>
              <li>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="text-left w-full hover:text-yellow-300"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
