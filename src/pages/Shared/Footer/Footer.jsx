import React, { useMemo } from "react";
import { NavLink, useLocation } from "react-router";
import { MapPin, Mail, Phone, Clock, Heart, Star } from "lucide-react";

// Constants for better maintainability
const SOCIAL_LINKS = [
  {
    name: "Facebook",
    icon: "📘",
    url: "https://facebook.com/mcms",
    ariaLabel: "Visit our Facebook page",
  },
  {
    name: "Twitter",
    icon: "🐦",
    url: "https://twitter.com/mcms",
    ariaLabel: "Visit our Twitter page",
  },
  {
    name: "LinkedIn",
    icon: "💼",
    url: "https://linkedin.com/company/mcms",
    ariaLabel: "Visit our LinkedIn page",
  },
  {
    name: "YouTube",
    icon: "▶️",
    url: "https://youtube.com/mcms",
    ariaLabel: "Visit our YouTube channel",
  },
];

const FOOTER_LINKS = [
  {
    title: "Quick Links",
    links: [
      { name: "Home", path: "/", ariaLabel: "Go to homepage" },
      {
        name: "Available Camps",
        path: "/available-camps",
        ariaLabel: "Browse available medical camps",
      },
      { name: "Join Us", path: "/login", ariaLabel: "Login to your account" },
      {
        name: "Dashboard",
        path: "/dashboard",
        ariaLabel: "Access your dashboard",
      },
      {
        name: "Feedback",
        path: "/feedback",
        ariaLabel: "View participant feedback",
      },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Blog", path: "/blog", ariaLabel: "Read our blog" },
      { name: "FAQs", path: "/faqs", ariaLabel: "Frequently asked questions" },
      { name: "Documentation", path: "/docs", ariaLabel: "View documentation" },
      {
        name: "Privacy Policy",
        path: "/pPolicy",
        ariaLabel: "Read privacy policy",
      },
      {
        name: "Terms of Service",
        path: "/terms",
        ariaLabel: "View terms of service",
      },
    ],
  },
];

const CONTACT_INFO = [
  {
    icon: MapPin,
    text: "Green Road, Dhaka, Bangladesh",
    ariaLabel: "Our location: Green Road, Dhaka, Bangladesh",
  },
  {
    icon: Mail,
    text: "support@mcms.com",
    ariaLabel: "Email us at support@mcms.com",
    href: "mailto:support@mcms.com",
  },
  {
    icon: Phone,
    text: "+880 1234-567890",
    ariaLabel: "Call us at +880 1234-567890",
    href: "tel:+8801234567890",
  },
  {
    icon: Clock,
    text: "Mon-Fri: 9AM - 6PM",
    ariaLabel: "Our working hours: Monday to Friday, 9AM to 6PM",
  },
];

const Footer = () => {
  const location = useLocation();
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  // Memoized logo component to prevent unnecessary re-renders
  const Logo = useMemo(
    () => (
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 bg-gradient-to-br from-[#F5F7F8] to-[#495E57]/20 rounded-xl flex items-center justify-center shadow-sm border border-[#495E57]/10"
          aria-hidden="true"
        >
          <img
            src="/mcmsLogo.png"
            alt="MCMS Logo"
            className="w-6 h-6 rounded-full"
            loading="lazy"
            width={24}
            height={24}
          />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-xl text-white leading-tight">
            MCMS
          </span>
          <span className="text-xs text-white/60 leading-tight">
            Medical Camp
          </span>
        </div>
      </div>
    ),
    []
  );

  // Social links component
  const SocialLinks = useMemo(
    () => (
      <div
        className="flex space-x-3"
        role="list"
        aria-label="Social media links"
      >
        {SOCIAL_LINKS.map((social) => (
          <a
            key={social.name}
            href={social.url}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#F4CE14] focus:ring-offset-2 focus:ring-offset-[#495E57]"
            aria-label={social.ariaLabel}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-sm" aria-hidden="true">
              {social.icon}
            </span>
          </a>
        ))}
      </div>
    ),
    []
  );

  // Contact info component
  const ContactInfo = useMemo(
    () => (
      <ul className="space-y-3" role="list">
        {CONTACT_INFO.map((item, index) => {
          const Icon = item.icon;
          const isLink = item.href;

          const content = (
            <>
              <Icon
                className="mt-0.5 flex-shrink-0 text-[#F4CE14]"
                size={18}
                aria-hidden="true"
              />
              <span className="text-white/80 text-sm">{item.text}</span>
            </>
          );

          return (
            <li key={index} className="flex items-start space-x-3">
              {isLink ? (
                <a
                  href={item.href}
                  className="flex items-start space-x-3 hover:text-[#F4CE14] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#F4CE14] focus:ring-offset-2 focus:ring-offset-[#495E57] rounded"
                  aria-label={item.ariaLabel}
                >
                  {content}
                </a>
              ) : (
                <div
                  className="flex items-start space-x-3"
                  aria-label={item.ariaLabel}
                >
                  {content}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    ),
    []
  );

  return (
    <footer
      className="bg-gradient-to-br from-[#495E57] via-[#495E57]/90 to-[#45474B] text-white mt-16"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
        {/* Brand Info */}
        <div className="space-y-4 lg:pr-4">
          {Logo}
          <p className="text-white/80 leading-relaxed text-sm">
            Medical Camp Management System helps organize and manage medical
            camps efficiently and securely across Bangladesh.
          </p>
          {SocialLinks}
        </div>

        {/* Links Sections */}
        {FOOTER_LINKS.map((section) => (
          <div key={section.title} className="space-y-4">
            <h3 className="text-lg font-semibold text-white/90">
              {section.title}
            </h3>
            <ul className="space-y-3" role="list">
              {section.links.map((link) => (
                <li key={link.name}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `block text-white/80 hover:text-[#F4CE14] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#F4CE14] focus:ring-offset-2 focus:ring-offset-[#495E57] rounded px-1 -mx-1 ${
                        isActive ? "text-[#F4CE14] font-medium" : ""
                      }`
                    }
                    aria-label={link.ariaLabel}
                    aria-current={
                      location.pathname === link.path ? "page" : undefined
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
          {ContactInfo}
        </div>
      </div>

      {/* Bottom Footer */}
      <div
        className="bg-gradient-to-r from-[#45474B] via-[#495E57]/80 to-[#45474B] py-6 border-t border-white/10"
        aria-label="Footer bottom section"
      >
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div
            className="text-white/80 text-sm mb-4 md:mb-0 flex items-center"
            aria-label={`Copyright ${currentYear} MCMS. All rights reserved.`}
          >
            <Star
              className="mr-2 text-[#F4CE14]"
              size={14}
              fill="#F4CE14"
              aria-hidden="true"
            />
            © {currentYear} MCMS. All rights reserved.
          </div>
          <div
            className="flex items-center space-x-6"
            role="list"
            aria-label="Legal links"
          >
            <a
              href="/pPolicy"
              className="text-white/80 hover:text-[#F4CE14] text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#F4CE14] focus:ring-offset-2 focus:ring-offset-[#495E57] rounded px-1 -mx-1"
              aria-label="Read our privacy policy"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-white/80 hover:text-[#F4CE14] text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#F4CE14] focus:ring-offset-2 focus:ring-offset-[#495E57] rounded px-1 -mx-1"
              aria-label="View terms of service"
            >
              Terms of Service
            </a>
            <div
              className="flex items-center text-sm text-white/80"
              aria-label="Made with love in Bangladesh"
            >
              <Heart
                className="mr-1 text-red-400 fill-current"
                size={14}
                aria-hidden="true"
              />
              Made with love in Bangladesh
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
