import React from 'react';
import { NavLink } from 'react-router';

const Footer = () => {
  return (
    <div className="bg-[#3A7CA5] text-white mt-10">
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* About Section */}
        <div>
          <h2 className="text-xl font-bold mb-3">MCMS</h2>
          <p className="text-sm">
            Medical Camp Management System helps organize and manage medical camps efficiently and securely.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li><NavLink to="/" className="hover:text-yellow-300">Home</NavLink></li>
            <li><NavLink to="/available-camps" className="hover:text-yellow-300">Available Camps</NavLink></li>
            <li><NavLink to="/login" className="hover:text-yellow-300">Join Us</NavLink></li>
            <li><NavLink to="/dashboard" className="hover:text-yellow-300">Dashboard</NavLink></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Contact Us</h2>
          <ul className="text-sm space-y-2">
            <li>Email: support@mcms.com</li>
            <li>Phone: +880 1234-567890</li>
            <li>Address: Green Road, Dhaka, Bangladesh</li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-[#2B6CB0] py-4 text-center text-sm">
        © {new Date().getFullYear()} MCMS. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
