import React, { useState } from "react";
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
} from "lucide-react";

const PPolicy = () => {
  const [activeSection, setActiveSection] = useState(null);
  const lastUpdated = "July 30, 2025";

  const sections = [
    {
      id: "info-collection",
      title: "Information We Collect",
      icon: <UserIcon className="w-5 h-5 text-blue-600" />,
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-2 rounded-lg mt-1">
              <UserIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                Personal Information
              </h3>
              <p className="text-gray-700">
                Name, email address, phone number, profile image, and other
                contact details.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-purple-100 p-2 rounded-lg mt-1">
              <CreditCard className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Registration Data</h3>
              <p className="text-gray-700">
                Medical camp registration details, payment information, and
                participation history.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-teal-100 p-2 rounded-lg mt-1">
              <Server className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Usage Data</h3>
              <p className="text-gray-700">
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
      icon: <Shield className="w-5 h-5 text-purple-600" />,
      content: (
        <ul className="list-disc pl-6 space-y-3 text-gray-700">
          <li>
            <strong>Service Delivery:</strong> Manage your camp registrations
            and provide access to platform features.
          </li>
          <li>
            <strong>Communication:</strong> Send important updates about your
            registrations and platform changes.
          </li>
          <li>
            <strong>Improvements:</strong> Analyze usage patterns to enhance
            user experience and develop new features.
          </li>
          <li>
            <strong>Security:</strong> Monitor for fraudulent activity and
            protect our services.
          </li>
        </ul>
      ),
    },
    {
      id: "data-protection",
      title: "Data Protection",
      icon: <Lock className="w-5 h-5 text-teal-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            We implement industry-standard security measures including
            encryption, access controls, and regular security audits to protect
            your information.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-2">
              Security Measures:
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>SSL/TLS encryption for all data transmissions</li>
              <li>Regular security vulnerability scanning</li>
              <li>Strict access controls and authentication protocols</li>
              <li>Secure data storage with encryption at rest</li>
            </ul>
          </div>
          <p className="text-gray-700 text-sm">
            While we strive to protect your personal information, no method of
            transmission over the Internet or electronic storage is 100% secure.
          </p>
        </div>
      ),
    },
    {
      id: "third-party",
      title: "Third-Party Services",
      icon: <Server className="w-5 h-5 text-amber-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            We may share your information with trusted third-party services that
            help us operate our platform:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <img
                  src="https://cdn.worldvectorlogo.com/logos/stripe-4.svg"
                  alt="Stripe"
                  className="h-5"
                />
                Stripe
              </h3>
              <p className="text-gray-700 text-sm">
                Payment processing services with PCI-DSS compliance.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <img
                  src="https://cdn.worldvectorlogo.com/logos/firebase-1.svg"
                  alt="Firebase"
                  className="h-5"
                />
                Firebase
              </h3>
              <p className="text-gray-700 text-sm">
                Authentication services with secure identity verification.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "contact",
      title: "Contact Us",
      icon: <Mail className="w-5 h-5 text-red-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            If you have any questions about this Privacy Policy or our data
            practices, please contact our Data Protection Officer:
          </p>
          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <h3 className="font-medium text-gray-900 mb-2">
              MCMS Support Team
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-600" />
                <a href="mailto:support@mcms.com" className="hover:underline">
                  support@mcms.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-red-600" />
                <a href="/contact" className="hover:underline">
                  Contact Form
                </a>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  const toggleSection = (id) => {
    setActiveSection(activeSection === id ? null : id);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f9ff] to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 font-medium mb-4">
            <Shield className="mr-2" size={20} />
            Your Privacy Matters
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            MCMS
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}
              Privacy Policy
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Last updated: {lastUpdated}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* TOC */}
          <nav
            aria-label="Table of contents"
            className="lg:sticky lg:top-24 lg:w-1/4 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-fit"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              Contents
            </h2>
            <ul className="space-y-3">
              {sections.map(({ id, title, icon }) => (
                <li key={id}>
                  <button
                    onClick={() => scrollToSection(id)}
                    className={`flex items-center gap-3 w-full text-left p-2 rounded-lg transition-colors ${
                      activeSection === id
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <span className="text-blue-600">{icon}</span>
                    <span>{title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content */}
          <article className="lg:w-3/4 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-8">
              <p className="text-gray-700 mb-8">
                Your privacy is important to us at MCMS (Medical Camp Management
                System). This Privacy Policy explains how we collect, use, and
                protect your personal information when you use our platform.
              </p>

              <div className="space-y-6">
                {sections.map(({ id, title, icon, content }) => (
                  <section
                    key={id}
                    id={id}
                    className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0"
                  >
                    <button
                      onClick={() => toggleSection(id)}
                      className="flex justify-between items-center w-full text-left group"
                      aria-expanded={activeSection === id}
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-2 rounded-lg">{icon}</div>
                        <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {title}
                        </h2>
                      </div>
                      <span className="text-gray-500">
                        {activeSection === id ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </span>
                    </button>

                    {activeSection === id && (
                      <div className="pl-16 mt-4 text-gray-700 animate-fadeIn">
                        {content}
                      </div>
                    )}
                  </section>
                ))}
              </div>
            </div>

            {/* Footer CTA */}
            <div className="bg-gray-50 p-8 border-t border-gray-200">
              <div className="max-w-2xl mx-auto text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Still have questions about your privacy?
                </h3>
                <p className="text-gray-600 mb-6">
                  Our support team is here to help you understand how we protect
                  your data.
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all group"
                >
                  Contact Our Privacy Team
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default PPolicy;
