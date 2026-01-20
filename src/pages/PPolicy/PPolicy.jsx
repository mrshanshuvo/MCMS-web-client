import React, { useState, useMemo, useCallback } from "react";
import {
  Shield,
  Lock,
  Mail,
  User as UserIcon,
  CreditCard,
  Server,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Star,
} from "lucide-react";
import { Link } from "react-router";

// Constants
const LAST_UPDATED = "July 30, 2025";

const SECTIONS = [
  {
    id: "info-collection",
    title: "Information We Collect",
    icon: <UserIcon className="w-5 h-5" />,
    content: (
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="bg-[#495E57]/10 p-2 rounded-lg mt-1 text-[#495E57]">
            <UserIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-medium text-[#45474B]">Personal Information</h3>
            <p className="text-[#45474B]/70">
              Name, email address, phone number, profile image, and other
              contact details.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="bg-[#495E57]/10 p-2 rounded-lg mt-1 text-[#495E57]">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-medium text-[#45474B]">Registration Data</h3>
            <p className="text-[#45474B]/70">
              Medical camp registration details, payment information, and
              participation history.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="bg-[#495E57]/10 p-2 rounded-lg mt-1 text-[#495E57]">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-medium text-[#45474B]">Usage Data</h3>
            <p className="text-[#45474B]/70">
              Browser type, IP address, pages visited, and other analytics to
              improve our services.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "info-use",
    title: "How We Use Your Information",
    icon: <Shield className="w-5 h-5" />,
    content: (
      <ul className="space-y-3 text-[#45474B]/70" role="list">
        {[
          {
            title: "Service Delivery:",
            description:
              "Manage your camp registrations and provide access to platform features.",
          },
          {
            title: "Communication:",
            description:
              "Send important updates about your registrations and platform changes.",
          },
          {
            title: "Improvements:",
            description:
              "Analyze usage patterns to enhance user experience and develop new features.",
          },
          {
            title: "Security:",
            description:
              "Monitor for fraudulent activity and protect our services.",
          },
        ].map((item, index) => (
          <li key={index} className="flex items-start">
            <span
              className="w-2 h-2 bg-[#F4CE14] rounded-full mt-2 mr-3 shrink-0"
              aria-hidden="true"
            ></span>
            <div>
              <strong className="text-[#45474B]">{item.title}</strong>{" "}
              {item.description}
            </div>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "data-protection",
    title: "Data Protection",
    icon: <Lock className="w-5 h-5" />,
    content: (
      <div className="space-y-4">
        <p className="text-[#45474B]/70">
          We implement industry-standard security measures including encryption,
          access controls, and regular security audits to protect your
          information.
        </p>
        <div className="bg-[#495E57]/5 p-4 rounded-lg border border-[#495E57]/10">
          <h3 className="font-medium text-[#45474B] mb-2">
            Security Measures:
          </h3>
          <ul className="space-y-2 text-[#45474B]/70" role="list">
            {[
              "SSL/TLS encryption for all data transmissions",
              "Regular security vulnerability scanning",
              "Strict access controls and authentication protocols",
              "Secure data storage with encryption at rest",
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <span
                  className="w-1.5 h-1.5 bg-[#F4CE14] rounded-full mt-2 mr-3 shrink-0"
                  aria-hidden="true"
                ></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-[#45474B]/50 text-sm">
          While we strive to protect your personal information, no method of
          transmission over the Internet or electronic storage is 100% secure.
        </p>
      </div>
    ),
  },
  {
    id: "third-party",
    title: "Third-Party Services",
    icon: <Server className="w-5 h-5" />,
    content: (
      <div className="space-y-4">
        <p className="text-[#45474B]/70">
          We may share your information with trusted third-party services that
          help us operate our platform:
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              name: "Stripe",
              logo: "https://cdn.worldvectorlogo.com/logos/stripe-4.svg",
              description:
                "Payment processing services with PCI-DSS compliance.",
            },
            {
              name: "Firebase",
              logo: "https://cdn.worldvectorlogo.com/logos/firebase-1.svg",
              description:
                "Authentication services with secure identity verification.",
            },
          ].map((service, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg border border-[#495E57]/10"
            >
              <h3 className="font-medium text-[#45474B] mb-2 flex items-center gap-2">
                <img
                  src={service.logo}
                  alt={service.name}
                  className="h-5"
                  loading="lazy"
                />
                {service.name}
              </h3>
              <p className="text-[#45474B]/70 text-sm">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "contact",
    title: "Contact Us",
    icon: <Mail className="w-5 h-5" />,
    content: (
      <div className="space-y-4">
        <p className="text-[#45474B]/70">
          If you have any questions about this Privacy Policy or our data
          practices, please contact our Data Protection Officer:
        </p>
        <div className="bg-[#495E57]/5 p-4 rounded-lg border border-[#495E57]/10">
          <h3 className="font-medium text-[#45474B] mb-2">
            CareCamp Support Team
          </h3>
          <ul className="space-y-2 text-[#45474B]/70">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#495E57]" />
              <a
                href="mailto:support@mcms.com"
                className="hover:underline focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:ring-offset-2 rounded"
              >
                support@mcms.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-[#495E57]" />
              <Link
                to="/contact"
                className="hover:underline focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:ring-offset-2 rounded"
              >
                Contact Form
              </Link>
            </li>
          </ul>
        </div>
      </div>
    ),
  },
];

const PPolicy = () => {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

  // Memoized event handlers
  const toggleSection = useCallback(
    (id) => {
      setActiveSection(activeSection === id ? null : id);
    },
    [activeSection],
  );

  const scrollToSection = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  }, []);

  // Memoized components
  const HeaderSection = useMemo(
    () => (
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-4 py-2 bg-[#495E57]/10 rounded-full text-[#495E57] font-medium mb-4">
          <Star size={16} className="text-[#F4CE14] mr-2" fill="#F4CE14" />
          Your Privacy Matters
        </div>
        <h1 className="text-4xl font-bold text-[#45474B] mb-4">
          CareCamp
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#495E57] to-[#F4CE14]">
            {" "}
            Privacy Policy
          </span>
        </h1>
        <p className="text-xl text-[#45474B]/70 max-w-3xl mx-auto">
          Last updated: {LAST_UPDATED}
        </p>
      </div>
    ),
    [],
  );

  const TableOfContents = useMemo(
    () => (
      <nav
        aria-label="Table of contents"
        className="lg:sticky lg:top-24 lg:w-1/4 bg-white rounded-2xl shadow-sm border border-[#495E57]/10 p-6 h-fit"
      >
        <h2 className="text-xl font-semibold text-[#45474B] mb-4 flex items-center gap-2">
          <span
            className="w-2 h-2 bg-[#495E57] rounded-full"
            aria-hidden="true"
          ></span>
          Contents
        </h2>
        <ul className="space-y-3" role="list">
          {SECTIONS.map(({ id, title, icon }) => (
            <li key={id}>
              <button
                onClick={() => scrollToSection(id)}
                className={`flex items-center gap-3 w-full text-left p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:ring-offset-2 ${
                  activeSection === id
                    ? "bg-[#495E57]/10 text-[#495E57]"
                    : "hover:bg-[#495E57]/5 text-[#45474B]"
                }`}
                aria-current={activeSection === id ? "location" : undefined}
              >
                <span className="text-[#495E57]">{icon}</span>
                <span className="font-medium">{title}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    ),
    [activeSection, scrollToSection],
  );

  const PolicyContent = useMemo(
    () => (
      <article
        className="lg:w-3/4 bg-white rounded-2xl shadow-sm border border-[#495E57]/10 overflow-hidden"
        itemScope
        itemType="https://schema.org/PrivacyPolicy"
      >
        <div className="p-8">
          <meta itemProp="datePublished" content="2024-01-01" />
          <meta itemProp="dateModified" content="2025-07-30" />

          <p className="text-[#45474B]/70 mb-8 leading-relaxed">
            Your privacy is important to us at CareCamp (Medical Camp Management
            System). This Privacy Policy explains how we collect, use, and
            protect your personal information when you use our platform.
          </p>

          <div className="space-y-6">
            {SECTIONS.map(({ id, title, icon, content }) => (
              <section
                key={id}
                id={id}
                className="border-b border-[#495E57]/10 last:border-b-0 pb-6 last:pb-0"
                itemScope
                itemProp="hasPart"
                itemType="https://schema.org/WebPageElement"
              >
                <button
                  onClick={() => toggleSection(id)}
                  className="flex justify-between items-center w-full text-left group focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:ring-offset-2 rounded-lg p-2 -m-2"
                  aria-expanded={activeSection === id}
                  aria-controls={`${id}-content`}
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-[#495E57]/10 p-2 rounded-lg text-[#495E57] group-hover:scale-110 transition-transform duration-200">
                      {icon}
                    </div>
                    <h2
                      className="text-xl font-semibold text-[#45474B] group-hover:text-[#495E57] transition-colors duration-200"
                      itemProp="name"
                    >
                      {title}
                    </h2>
                  </div>
                  <span className="text-[#495E57] transition-transform duration-200">
                    {activeSection === id ? (
                      <ChevronUp size={20} aria-hidden="true" />
                    ) : (
                      <ChevronDown size={20} aria-hidden="true" />
                    )}
                  </span>
                </button>

                {activeSection === id && (
                  <div
                    id={`${id}-content`}
                    className="pl-16 mt-4 text-[#45474B]/70 animate-fadeIn"
                    itemProp="text"
                  >
                    {content}
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="bg-[#495E57]/5 p-8 border-t border-[#495E57]/10">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-semibold text-[#45474B] mb-3">
              Still have questions about your privacy?
            </h3>
            <p className="text-[#45474B]/70 mb-6 leading-relaxed">
              Our support team is here to help you understand how we protect
              your data.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#495E57] to-[#495E57]/90 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:ring-offset-2"
              aria-label="Contact our privacy team"
            >
              Contact Our Privacy Team
              <ArrowRight
                className="ml-2 text-[#F4CE14] group-hover:translate-x-1 transition-transform duration-200"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </article>
    ),
    [activeSection, toggleSection],
  );

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#F5F7F8] to-white py-12 px-4 sm:px-6 lg:px-8"
      role="main"
      aria-label="Privacy Policy"
    >
      <div className="max-w-6xl mx-auto">
        {HeaderSection}

        <div className="flex flex-col lg:flex-row gap-8">
          {TableOfContents}
          {PolicyContent}
        </div>
      </div>
    </div>
  );
};

export default React.memo(PPolicy);
