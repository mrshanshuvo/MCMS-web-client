import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { Menu, X } from 'lucide-react';
import { AuthContext } from '../../../contexts/AuthContext/AuthContext';
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/available-camps', label: 'Available Camps' },
  ];

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-blue-600 text-white shadow">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="MCMS Logo" className="w-8 h-8 rounded-full" />
          <NavLink to="/" className="text-xl font-bold">MCMS</NavLink>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  isActive
                    ? 'text-yellow-300 font-semibold'
                    : 'hover:text-yellow-200 transition'
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}

          {!user ? (
            <li>
              <NavLink
                to="/join-us"
                className="bg-yellow-400 text-black px-4 py-1 rounded hover:bg-yellow-300 transition"
              >
                Join Us
              </NavLink>
            </li>
          ) : (
            <div className="relative group">
              <img
                src={user.photoURL}
                alt="User"
                className="w-10 h-10 rounded-full cursor-pointer border-2 border-white"
              />
              <ul className="absolute right-0 mt-2 bg-white text-black shadow rounded hidden group-hover:block w-48">
                <li className="px-4 py-2 font-semibold border-b">{user.displayName}</li>
                <li>
                  <NavLink to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </ul>

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="md:hidden bg-blue-500 px-4 pb-4 space-y-2">
          {navLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? 'block text-yellow-300 font-semibold'
                    : 'block hover:text-yellow-200 transition'
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}

          {!user ? (
            <li>
              <NavLink
                to="/join-us"
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
                <button onClick={handleLogout} className="text-left w-full">
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
