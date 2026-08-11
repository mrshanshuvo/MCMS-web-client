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
  const [scrolled, setScrolled] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <nav
      className={`sticky top-0 z-50 transition-all duration-200 border-b ${
        scrolled
          ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm border-slate-200/80 dark:border-slate-800/80'
          : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/40 dark:border-slate-800/40'
      }`}
    >
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
                    ? 'text-[#495E57] bg-[#495E57]/10 dark:text-emerald-400 dark:bg-emerald-500/10 font-semibold'
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
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none rounded-full ring-offset-2 focus:ring-2 focus:ring-[#495E57]">
                  <Avatar className="h-8 w-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-transform hover:scale-105">
                    <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />
                    <AvatarFallback className="bg-[#495E57] text-white text-xs font-semibold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56 p-1.5 shadow-lg rounded-xl border">
                  <DropdownMenuLabel className="font-normal px-2 py-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                        {user.displayName || 'Participant'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => navigate('/dashboard')}
                    className="cursor-pointer rounded-lg px-2 py-2 text-sm text-slate-700 dark:text-slate-200 focus:bg-slate-100 dark:focus:bg-slate-800"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4 text-[#495E57]" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => navigate('/dashboard/profile')}
                    className="cursor-pointer rounded-lg px-2 py-2 text-sm text-slate-700 dark:text-slate-200 focus:bg-slate-100 dark:focus:bg-slate-800"
                  >
                    <UserCheck className="mr-2 h-4 w-4 text-[#495E57]" />
                    <span>My Profile</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer rounded-lg px-2 py-2 text-sm text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50"
                  >
                    <LogOut className="mr-2 h-4 w-4 text-red-500" />
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
                    ? 'bg-[#495E57]/10 text-[#495E57] dark:text-emerald-400 font-semibold'
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
