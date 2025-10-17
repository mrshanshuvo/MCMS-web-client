import React, { useState, useEffect, useRef } from "react";
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Mock user for demo - replace with actual auth context
  const user = null; // Set to { displayName: "John Doe", email: "john@example.com", photoURL: null } to test logged-in state

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/available-camps", label: "Available Camps" },
    { path: "/success-stories", label: "Success Stories" },
    { path: "/about", label: "About Us" },
    { path: "/contact", label: "Contact Us" },
  ];

  const handleLogout = () => {
    console.log("Logging out...");
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown/menu if click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest('button[aria-label="Toggle Menu"]')
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-3 group"
            onClick={() => setIsOpen(false)}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-[#ffffff] to-[#99bbff] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
              <img src="/mcmsLogo.png" alt="MCMS Logo" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-[#45474B] leading-tight">
                MCMS
              </span>
              <span className="text-xs text-[#495E57]/60 leading-tight">
                Medical Camp
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <ul className="flex gap-1 items-center">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <a
                    href={link.path}
                    className="px-4 py-2 font-medium text-[#45474B] hover:text-[#495E57] hover:bg-[#F5F7F8] rounded-lg transition-all duration-200 relative group"
                  >
                    {link.label}
                    <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-[#F4CE14] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </a>
                </li>
              ))}
            </ul>

            {!user ? (
              <a
                href="/login"
                className="bg-[#495E57] text-[#F5F7F8] px-6 py-2.5 rounded-xl font-semibold shadow-md hover:bg-[#45474B] hover:shadow-lg transition-all duration-300 flex items-center gap-2 group"
              >
                <span>Join Us</span>
                <User
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />
              </a>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#F5F7F8] transition-all duration-200 group"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#495E57] to-[#45474B] flex items-center justify-center text-[#F4CE14] font-semibold border-2 border-[#F4CE14]/20 group-hover:border-[#F4CE14]/40 transition-all shadow-md">
                    {user.displayName?.[0]?.toUpperCase() || "U"}
                  </div>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white shadow-2xl rounded-2xl overflow-hidden border border-[#495E57]/10 animate-[slideDown_0.2s_ease-out]">
                    <div className="px-5 py-4 border-b border-[#495E57]/10 bg-gradient-to-br from-[#F5F7F8] to-white">
                      <p className="font-semibold text-[#45474B] truncate">
                        {user.displayName}
                      </p>
                      <p className="text-sm text-[#495E57]/60 truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>

                    <a
                      href="/dashboard"
                      className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#F5F7F8] transition-colors group"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#495E57]/10 flex items-center justify-center group-hover:bg-[#495E57]/20 transition-colors">
                        <LayoutDashboard size={16} className="text-[#495E57]" />
                      </div>
                      <span className="text-[#45474B] font-medium">
                        Dashboard
                      </span>
                    </a>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left flex items-center gap-3 px-5 py-3.5 hover:bg-red-50 transition-colors border-t border-[#495E57]/10 group"
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
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2.5 rounded-xl hover:bg-[#F5F7F8] transition-colors text-[#45474B]"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          ref={mobileMenuRef}
          className="lg:hidden bg-white border-t border-[#495E57]/10 absolute w-full shadow-2xl animate-[slideDown_0.3s_ease-out]"
        >
          <div className="container mx-auto px-4 py-6">
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <a
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 rounded-xl font-medium text-[#45474B] hover:bg-[#F5F7F8] hover:text-[#495E57] transition-all duration-200"
                  >
                    {link.label}
                  </a>
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
                    <a
                      href="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#45474B] hover:bg-[#F5F7F8] transition-all"
                    >
                      <LayoutDashboard size={20} />
                      <span className="font-medium">Dashboard</span>
                    </a>
                  </li>
                  <li>
                    <button
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
                  <a
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 bg-[#495E57] text-[#F5F7F8] px-4 py-3 rounded-xl font-semibold shadow-md hover:bg-[#45474B] transition-all"
                  >
                    <span>Join Us</span>
                    <User size={18} />
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </nav>
  );
};

export default React.memo(Navbar);
