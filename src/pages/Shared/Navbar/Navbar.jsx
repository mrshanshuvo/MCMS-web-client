import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { Menu, X, User, LogOut, LayoutDashboard, UserCheck } from 'lucide-react';
import { AuthContext } from '../../../contexts/AuthContext/AuthContext';
import CareCampLogo from '../CareCampLogo/CareCampLogo';
import NotificationBell from '../../../components/Notifications/NotificationBell';
import ThemeToggle from '../../../components/Common/ThemeToggle';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const menuBtnRef = useRef(null);

  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const navLinks = useMemo(
    () =>
      !user
        ? [
            { path: '/', label: 'Home' },
            { path: '/available-camps', label: 'Available Camps' },
            { path: '/about', label: 'About Us' },
            { path: '/faqs', label: 'FAQs' },
          ]
        : [
            { path: '/', label: 'Home' },
            { path: '/available-camps', label: 'Available Camps' },
            { path: '/success-stories', label: 'Success Stories' },
            { path: '/about', label: 'About Us' },
            { path: '/blog', label: 'Blog' },
            { path: '/faqs', label: 'FAQs' },
          ],
    [user]
  );

  const userInitials = useMemo(() => {
    if (!user?.displayName) return 'U';
    const parts = user.displayName.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch {
      // Logout handler fallback
    }
  };

  // Close mobile menu on outside click or escape
  useEffect(() => {
    const handlePointerDown = (e) => {
      const target = e.target;
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        menuBtnRef.current &&
        !menuBtnRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 w-full z-50 border-b bg-white dark:bg-slate-900 backdrop-blur-md border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 shadow-xs transition-colors duration-200">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between h-14">
        {/* Logo */}
        <CareCampLogo />

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-150 ${
                  isActive
                    ? 'text-[#495E57] bg-[#495E57]/10 dark:text-[#F4CE14] dark:bg-[#F4CE14]/15 font-semibold'
                    : 'text-slate-600 hover:text-[#495E57] hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right Section / Auth Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {!user ? (
            <NavLink
              to="/login"
              className="bg-[#495E57] hover:bg-[#3d4f49] text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-sm hover:shadow transition-all duration-200 flex items-center gap-1.5 group"
            >
              <span>Join Us</span>
              <User size={16} className="group-hover:scale-110 transition-transform" />
            </NavLink>
          ) : (
            <>
              <NotificationBell />

              {/* Shadcn Dropdown Menu for User Profile */}
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger className="focus:outline-none rounded-full ring-offset-2 focus:ring-2 focus:ring-[#495E57]">
                  <Avatar className="h-8 w-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-transform hover:scale-105">
                    <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />
                    <AvatarFallback className="bg-[#495E57] text-white text-xs font-semibold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-64 p-2 shadow-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 animate-in fade-in-80 zoom-in-95"
                >
                  <DropdownMenuLabel className="font-normal p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl mb-1 border border-slate-100 dark:border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-700">
                        <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />
                        <AvatarFallback className="bg-[#495E57] text-white text-xs font-semibold">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-0.5 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {user.displayName || 'Participant'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator className="my-1 bg-slate-200 dark:bg-slate-800" />

                  <DropdownMenuItem
                    onClick={() => navigate('/dashboard')}
                    className="cursor-pointer rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800 transition-colors"
                  >
                    <LayoutDashboard className="mr-2.5 h-4 w-4 text-[#495E57] dark:text-[#F4CE14]" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => navigate('/dashboard/profile')}
                    className="cursor-pointer rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800 transition-colors"
                  >
                    <UserCheck className="mr-2.5 h-4 w-4 text-[#495E57] dark:text-[#F4CE14]" />
                    <span>My Profile</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-1 bg-slate-200 dark:bg-slate-800" />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 focus:bg-red-50 dark:focus:bg-red-950/40 transition-colors"
                  >
                    <LogOut className="mr-2.5 h-4 w-4 text-red-500" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            ref={menuBtnRef}
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div
          ref={mobileMenuRef}
          className="lg:hidden bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 px-4 py-3 space-y-2 shadow-lg animate-in slide-in-from-top-2"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#495E57]/10 text-[#495E57] dark:bg-[#F4CE14]/15 dark:text-[#F4CE14] font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};

export default React.memo(Navbar);
