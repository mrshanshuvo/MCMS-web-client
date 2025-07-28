import React from 'react';
import { NavLink } from 'react-router';
import { MapPin, Mail, Phone, Clock, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Quick Links",
      links: [
        { name: "Home", path: "/" },
        { name: "Available Camps", path: "/available-camps" },
        { name: "Join Us", path: "/login" },
        { name: "Dashboard", path: "/dashboard" },
        { name: "Success Stories", path: "/success-stories" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Blog", path: "/blog" },
        { name: "FAQs", path: "/faqs" },
        { name: "Documentation", path: "/docs" },
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Terms of Service", path: "/terms" }
      ]
    }
  ];

  const contactInfo = [
    { icon: MapPin, text: "Green Road, Dhaka, Bangladesh" },
    { icon: Mail, text: "support@mcms.com" },
    { icon: Phone, text: "+880 1234-567890" },
    { icon: Clock, text: "Mon-Fri: 9AM - 6PM" }
  ];

  return (
    <footer className="bg-gradient-to-br from-[#1e3a8a] via-[#3A7CA5] to-[#0f766e] text-white mt-16">
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand Info */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            MCMS
          </h2>
          <p className="text-blue-100 leading-relaxed">
            Medical Camp Management System helps organize and manage medical camps efficiently and securely across Bangladesh.
          </p>
          <div className="flex space-x-4">
            {['Facebook', 'Twitter', 'LinkedIn', 'YouTube'].map((social) => (
              <a
                key={social}
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label={`${social} page`}
              >
                <span className="text-lg">{social === 'YouTube' ? '▶️' : social[0]}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Links Sections */}
        {footerLinks.map((section) => (
          <div key={section.title} className="space-y-4">
            <h3 className="text-lg font-semibold text-white/90">{section.title}</h3>
            <ul className="space-y-3">
              {section.links.map((link) => (
                <li key={link.name}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `text-blue-100 hover:text-yellow-300 transition-colors ${isActive ? 'text-yellow-300 font-medium' : ''}`
                    }
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white/90">Contact Us</h3>
          <ul className="space-y-3">
            {contactInfo.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={index} className="flex items-start space-x-3">
                  <Icon className="mt-0.5 flex-shrink-0 text-yellow-300" size={18} />
                  <span className="text-blue-100">{item.text}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gradient-to-r from-blue-900/50 via-blue-800/30 to-teal-900/50 py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-blue-100 text-sm mb-4 md:mb-0">
            © {currentYear} MCMS. All rights reserved.
          </div>
          <div className="flex items-center space-x-6">
            <a href="#" className="text-blue-100 hover:text-yellow-300 text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-blue-100 hover:text-yellow-300 text-sm transition-colors">
              Terms of Service
            </a>
            <div className="flex items-center text-sm text-blue-100">
              <Heart className="mr-1 text-red-400 fill-current" size={14} />
              Made with love in Bangladesh
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);