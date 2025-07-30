import React, { useState } from "react";
import {
  ClipboardCheck,
  CreditCard,
  Shield,
  AlertTriangle,
  RefreshCw,
  Mail,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from "lucide-react";

const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState(null);
  const lastUpdated = "July 30, 2025";

  const sections = [
    {
      id: "user-responsibilities",
      title: "User Responsibilities",
      icon: <ClipboardCheck className="w-5 h-5 text-blue-600" />,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-medium text-gray-900 mb-2">You agree to:</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>
                Provide accurate and complete information during registration
              </li>
              <li>Use the platform only for lawful purposes</li>
              <li>Not engage in any fraudulent or harmful activities</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </div>
          <p className="text-gray-700 text-sm">
            Violation of these responsibilities may result in account suspension
            or termination.
          </p>
        </div>
      ),
    },
    {
      id: "registration-payment",
      title: "Registration & Payment",
      icon: <CreditCard className="w-5 h-5 text-purple-600" />,
      content: (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">Registration</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm">
                <li>Must be 18+ or have guardian consent</li>
                <li>Valid email required for verification</li>
                <li>Complete profile for camp participation</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">Payments</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm">
                <li>Processed securely via Stripe</li>
                <li>Fees typically non-refundable</li>
                <li>Taxes may apply</li>
              </ul>
            </div>
          </div>
          <p className="text-gray-700 text-sm">
            Some camps may have specific eligibility requirements or refund
            policies.
          </p>
        </div>
      ),
    },
    {
      id: "account-security",
      title: "Account Security",
      icon: <Shield className="w-5 h-5 text-teal-600" />,
      content: (
        <div className="space-y-4">
          <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
            <h3 className="font-medium text-gray-900 mb-2">
              Your Responsibilities:
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Keep your password confidential</li>
              <li>Notify us immediately of unauthorized access</li>
              <li>Use strong authentication methods</li>
              <li>Log out after each session on shared devices</li>
            </ul>
          </div>
          <p className="text-gray-700">
            While we implement security measures, you are responsible for all
            activities under your account.
          </p>
        </div>
      ),
    },
    {
      id: "limitation-liability",
      title: "Limitation of Liability",
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      content: (
        <div className="space-y-4">
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
            <h3 className="font-medium text-gray-900 mb-2">
              MCMS is not liable for:
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Any indirect, incidental or consequential damages</li>
              <li>Loss of data or profits</li>
              <li>Service interruptions beyond our control</li>
              <li>User-generated content or third-party services</li>
            </ul>
          </div>
          <p className="text-gray-700 text-sm">
            Some jurisdictions don't allow limitation of liability, so these
            restrictions may not apply to you.
          </p>
        </div>
      ),
    },
    {
      id: "changes-terms",
      title: "Changes to Terms",
      icon: <RefreshCw className="w-5 h-5 text-indigo-600" />,
      content: (
        <div className="space-y-4">
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
            <h3 className="font-medium text-gray-900 mb-2">
              Modification Process:
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>We may update these terms periodically</li>
              <li>Changes will be posted on this page</li>
              <li>Continued use constitutes acceptance</li>
              <li>Material changes may include additional notice</li>
            </ul>
          </div>
          <p className="text-gray-700">
            We recommend reviewing these terms regularly to stay informed of
            updates.
          </p>
        </div>
      ),
    },
    {
      id: "contact",
      title: "Contact Us",
      icon: <Mail className="w-5 h-5 text-red-600" />,
      content: (
        <div className="space-y-4">
          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <h3 className="font-medium text-gray-900 mb-2">Have questions?</h3>
            <p className="text-gray-700 mb-3">
              For any inquiries about these Terms of Service, please contact:
            </p>
            <div className="flex items-center gap-2 text-red-600">
              <Mail className="w-5 h-5" />
              <a href="mailto:support@mcms.com" className="hover:underline">
                support@mcms.com
              </a>
            </div>
          </div>
          <p className="text-gray-700 text-sm">
            We typically respond to inquiries within 1-2 business days.
          </p>
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
            <ClipboardCheck className="mr-2" size={20} />
            Legal Agreement
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            MCMS
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}
              Terms of Service
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
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-8">
                  Welcome to MCMS (Medical Camp Management System). By accessing
                  or using our platform, you agree to comply with and be bound
                  by these Terms of Service. Please read them carefully before
                  using our services.
                </p>

                <div className="space-y-8">
                  {sections.map(({ id, title, icon, content }) => (
                    <section
                      key={id}
                      id={id}
                      className="border-b border-gray-200 last:border-b-0 pb-8 last:pb-0"
                    >
                      <button
                        onClick={() => toggleSection(id)}
                        className="flex justify-between items-center w-full text-left group"
                        aria-expanded={activeSection === id}
                      >
                        <div className="flex items-center gap-4">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            {icon}
                          </div>
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
            </div>

            {/* Acceptance Section */}
            <div className="bg-gray-50 p-8 border-t border-gray-200">
              <div className="max-w-2xl mx-auto text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  By using MCMS, you acknowledge that:
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 text-left mb-6">
                  <li>You have read and understood these Terms of Service</li>
                  <li>You agree to be bound by these terms</li>
                  <li>
                    You are at least 18 years old or have guardian consent
                  </li>
                </ul>
                <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all group">
                  I Accept These Terms
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
