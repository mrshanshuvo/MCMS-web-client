import React from "react";
import { NavLink } from "react-router";
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  Heart,
  Star,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
} from "lucide-react";
import CareCampLogo from "../CareCampLogo/CareCampLogo";

const SOCIAL_LINKS = [
  {
    name: "Facebook",
    icon: Facebook,
    url: "https://facebook.com/carecamp",
    ariaLabel: "Visit CareCamp on Facebook",
  },
  {
    name: "Twitter",
    icon: Twitter,
    url: "https://twitter.com/carecamp",
    ariaLabel: "Visit CareCamp on Twitter",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    url: "https://linkedin.com/company/carecamp",
    ariaLabel: "Visit CareCamp on LinkedIn",
  },
  {
    name: "YouTube",
    icon: Youtube,
    url: "https://youtube.com/@carecamp",
    ariaLabel: "Visit CareCamp on YouTube",
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
    text: "support@carecamp.com",
    ariaLabel: "Email us at support@carecamp.com",
    href: "mailto:support@carecamp.com",
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

const linkBase =
  "text-white/80 hover:text-[#F4CE14] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#F4CE14] focus:ring-offset-2 focus:ring-offset-[#495E57] rounded px-1 -mx-1";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-gradient-to-br from-[#495E57] via-[#495E57]/90 to-[#45474B] text-white mt-16"
      aria-label="Site footer"
    >
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
        {/* Brand Info */}
        <div className="space-y-4 lg:pr-4">
          <CareCampLogo variant="light" />
          <p className="text-white/80 leading-relaxed text-sm">
            CareCamp helps organize and manage medical camps efficiently and
            securely across Bangladesh.
          </p>

          {/* Social Links */}
          <ul className="flex gap-3" aria-label="Social media links">
            {SOCIAL_LINKS.map((social) => {
              const Icon = social.icon;
              return (
                <li key={social.name}>
                  <a
                    href={social.url}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#F4CE14] focus:ring-offset-2 focus:ring-offset-[#495E57]"
                    aria-label={social.ariaLabel}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon size={16} className="text-white" aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Link Sections */}
        {FOOTER_LINKS.map((section) => (
          <div key={section.title} className="space-y-4">
            <h3 className="text-lg font-semibold text-white/90">
              {section.title}
            </h3>

            <ul className="space-y-3">
              {section.links.map((link) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `block ${linkBase} ${isActive ? "text-[#F4CE14] font-medium" : ""}`
                    }
                    aria-label={link.ariaLabel}
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
            {CONTACT_INFO.map((item) => {
              const Icon = item.icon;
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
                <li key={item.text} className="flex items-start gap-3">
                  {item.href ? (
                    <a
                      href={item.href}
                      className="flex items-start gap-3 hover:text-[#F4CE14] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#F4CE14] focus:ring-offset-2 focus:ring-offset-[#495E57] rounded"
                      aria-label={item.ariaLabel}
                    >
                      {content}
                    </a>
                  ) : (
                    <div
                      className="flex items-start gap-3"
                      aria-label={item.ariaLabel}
                    >
                      {content}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gradient-to-r from-[#45474B] via-[#495E57]/80 to-[#45474B] py-6 border-t border-white/10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div
            className="text-white/80 text-sm flex items-center"
            aria-label={`Copyright ${currentYear} CareCamp. All rights reserved.`}
          >
            <Star
              className="mr-2 text-[#F4CE14]"
              size={14}
              fill="#F4CE14"
              aria-hidden="true"
            />
            © {currentYear} CareCamp. All rights reserved.
          </div>

          <div
            className="flex flex-wrap items-center gap-x-4 gap-y-2"
            aria-label="Legal links"
          >
            <NavLink
              to="/pPolicy"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? "text-[#F4CE14] font-medium" : ""}`
              }
              aria-label="Read our privacy policy"
            >
              Privacy Policy
            </NavLink>

            <NavLink
              to="/terms"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? "text-[#F4CE14] font-medium" : ""}`
              }
              aria-label="View terms of service"
            >
              Terms of Service
            </NavLink>

            <div
              className="flex items-center text-sm text-white/80"
              aria-label="Made with love in Bangladesh"
            >
              Made with{" "}
              <Heart
                className="mx-2 text-red-400 fill-current"
                size={14}
                aria-hidden="true"
              />{" "}
              in Bangladesh
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
