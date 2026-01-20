import React, { useState, useEffect, useRef, useContext, useMemo } from "react";
import { NavLink, useNavigate } from "react-router";
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { AuthContext } from "../../../contexts/AuthContext/AuthContext";
import CareCampLogo from "../CareCampLogo/CareCampLogo";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const menuBtnRef = useRef(null);

  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const navLinks = useMemo(
    () =>
      !user
        ? [
            { path: "/", label: "Home" },
            { path: "/available-camps", label: "Available Camps" },
            { path: "/about", label: "About Us" },
          ]
        : [
            { path: "/", label: "Home" },
            { path: "/available-camps", label: "Available Camps" },
            { path: "/success-stories", label: "Success Stories" },
            { path: "/about", label: "About Us" },
            { path: "/contact", label: "Contact Us" },
          ],
    [user],
  );

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close on outside click (dropdown + mobile menu)
  useEffect(() => {
    const handlePointerDown = (e) => {
      const target = e.target;

      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setDropdownOpen(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        menuBtnRef.current &&
        !menuBtnRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setDropdownOpen(false);
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-lg"
          : "bg-white/95 backdrop-blur-md shadow-md"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <CareCampLogo />

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <ul className="flex gap-1 items-center">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `px-4 py-2 font-medium rounded-lg transition-all duration-200 relative group ${
                        isActive
                          ? "text-[#495E57] bg-[#F5F7F8]"
                          : "text-[#45474B] hover:text-[#495E57] hover:bg-[#F5F7F8]"
                      }`
                    }
                  >
                    {link.label}
                    <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-[#F4CE14] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Auth area */}
            {!user ? (
              <NavLink
                to="/login"
                className="bg-[#495E57] text-[#F5F7F8] px-6 py-2.5 rounded-xl font-semibold shadow-md hover:bg-[#45474B] hover:shadow-lg transition-all duration-300 flex items-center gap-2 group"
              >
                <span>Join Us</span>
                <User
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />
              </NavLink>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#F5F7F8] transition-all duration-200 group"
                  onClick={() => setDropdownOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={dropdownOpen}
                  aria-controls="user-menu"
                >
                  <img
                    src={user.photoURL || "/default-avatar.png"}
                    alt={user.displayName || "User"}
                    className="w-10 h-10 rounded-full border-2 border-[#F4CE14]/30 group-hover:border-[#F4CE14]/60 transition-all shadow-md object-cover"
                  />
                </button>

                {dropdownOpen && (
                  <div
                    id="user-menu"
                    role="menu"
                    className="absolute right-0 mt-3 w-64 bg-white shadow-2xl rounded-2xl overflow-hidden border border-[#495E57]/10 animate-[slideDown_0.2s_ease-out]"
                  >
                    <div className="px-5 py-4 border-b border-[#495E57]/10 bg-gradient-to-br from-[#F5F7F8] to-white">
                      <p className="font-semibold text-[#45474B] truncate">
                        {user.displayName || "User"}
                      </p>
                      <p className="text-sm text-[#495E57]/60 truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>

                    <NavLink
                      to="/dashboard"
                      className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#F5F7F8] transition-colors group"
                      onClick={() => setDropdownOpen(false)}
                      role="menuitem"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#495E57]/10 flex items-center justify-center group-hover:bg-[#495E57]/20 transition-colors">
                        <LayoutDashboard size={16} className="text-[#495E57]" />
                      </div>
                      <span className="text-[#45474B] font-medium">
                        Dashboard
                      </span>
                    </NavLink>

                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left flex items-center gap-3 px-5 py-3.5 hover:bg-red-50 transition-colors border-t border-[#495E57]/10 group"
                      role="menuitem"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                        <LogOut size={16} className="text-red-500" />
                      </div>
                      <span className="text-[#45474B] font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={menuBtnRef}
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            className="lg:hidden p-2.5 rounded-xl hover:bg-[#F5F7F8] transition-colors text-[#45474B]"
            aria-label="Toggle Menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          id="mobile-menu"
          ref={mobileMenuRef}
          className="lg:hidden bg-white border-t border-[#495E57]/10 absolute w-full shadow-2xl animate-[slideDown_0.3s_ease-out]"
        >
          <div className="container mx-auto px-4 py-6">
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-xl font-medium text-[#45474B] transition-all duration-200 ${
                        isActive
                          ? "bg-[#F5F7F8] text-[#495E57]"
                          : "hover:bg-[#F5F7F8] hover:text-[#495E57]"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}

              {user ? (
                <>
                  <li className="px-4 py-3 text-sm text-[#495E57]/60 border-t border-[#495E57]/10 mt-4">
                    <div className="font-medium text-[#45474B] mb-1">
                      {user.displayName}
                    </div>
                    <div>{user.email}</div>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#45474B] hover:bg-[#F5F7F8] transition-all"
                    >
                      <LayoutDashboard size={20} />
                      <span className="font-medium">Dashboard</span>
                    </NavLink>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
                    >
                      <LogOut size={20} />
                      <span className="font-medium">Logout</span>
                    </button>
                  </li>
                </>
              ) : (
                <li className="mt-4">
                  <NavLink
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 bg-[#495E57] text-[#F5F7F8] px-4 py-3 rounded-xl font-semibold shadow-md hover:bg-[#45474B] transition-all"
                  >
                    <span>Join Us</span>
                    <User size={18} />
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  );
};

export default React.memo(Navbar);
