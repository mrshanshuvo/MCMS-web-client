import React, { useState, useMemo, useCallback } from "react";
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
  Star,
} from "lucide-react";
import { Link } from "react-router";

// Constants
const LAST_UPDATED = "July 30, 2025";

const SECTIONS = [
  {
    id: "user-responsibilities",
    title: "User Responsibilities",
    icon: <ClipboardCheck className="w-5 h-5" />,
    content: (
      <div className="space-y-4">
        <div className="bg-[#495E57]/5 p-4 rounded-lg border border-[#495E57]/10">
          <h3 className="font-medium text-[#45474B] mb-2">You agree to:</h3>
          <ul className="space-y-2 text-[#45474B]/70" role="list">
            {[
              "Provide accurate and complete information during registration",
              "Use the platform only for lawful purposes",
              "Not engage in any fraudulent or harmful activities",
              "Comply with all applicable laws and regulations",
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <span
                  className="w-2 h-2 bg-[#F4CE14] rounded-full mt-2 mr-3 shrink-0"
                  aria-hidden="true"
                ></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-[#45474B]/50 text-sm">
          Violation of these responsibilities may result in account suspension
          or termination.
        </p>
      </div>
    ),
  },
  {
    id: "registration-payment",
    title: "Registration & Payment",
    icon: <CreditCard className="w-5 h-5" />,
    content: (
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              title: "Registration",
              items: [
                "Must be 18+ or have guardian consent",
                "Valid email required for verification",
                "Complete profile for camp participation",
              ],
            },
            {
              title: "Payments",
              items: [
                "Processed securely via Stripe",
                "Fees typically non-refundable",
                "Taxes may apply",
              ],
            },
          ].map((category, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg border border-[#495E57]/10"
            >
              <h3 className="font-medium text-[#45474B] mb-2">
                {category.title}
              </h3>
              <ul className="space-y-1 text-[#45474B]/70 text-sm" role="list">
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <span
                      className="w-1.5 h-1.5 bg-[#F4CE14] rounded-full mt-2 mr-3 shrink-0"
                      aria-hidden="true"
                    ></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-[#45474B]/50 text-sm">
          Some camps may have specific eligibility requirements or refund
          policies.
        </p>
      </div>
    ),
  },
  {
    id: "account-security",
    title: "Account Security",
    icon: <Shield className="w-5 h-5" />,
    content: (
      <div className="space-y-4">
        <div className="bg-[#495E57]/5 p-4 rounded-lg border border-[#495E57]/10">
          <h3 className="font-medium text-[#45474B] mb-2">
            Your Responsibilities:
          </h3>
          <ul className="space-y-2 text-[#45474B]/70" role="list">
            {[
              "Keep your password confidential",
              "Notify us immediately of unauthorized access",
              "Use strong authentication methods",
              "Log out after each session on shared devices",
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <span
                  className="w-2 h-2 bg-[#F4CE14] rounded-full mt-2 mr-3 shrink-0"
                  aria-hidden="true"
                ></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-[#45474B]/70">
          While we implement security measures, you are responsible for all
          activities under your account.
        </p>
      </div>
    ),
  },
  {
    id: "limitation-liability",
    title: "Limitation of Liability",
    icon: <AlertTriangle className="w-5 h-5" />,
    content: (
      <div className="space-y-4">
        <div className="bg-[#495E57]/5 p-4 rounded-lg border border-[#495E57]/10">
          <h3 className="font-medium text-[#45474B] mb-2">
            CareCamp is not liable for:
          </h3>
          <ul className="space-y-2 text-[#45474B]/70" role="list">
            {[
              "Any indirect, incidental or consequential damages",
              "Loss of data or profits",
              "Service interruptions beyond our control",
              "User-generated content or third-party services",
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <span
                  className="w-2 h-2 bg-[#F4CE14] rounded-full mt-2 mr-3 shrink-0"
                  aria-hidden="true"
                ></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-[#45474B]/50 text-sm">
          Some jurisdictions don't allow limitation of liability, so these
          restrictions may not apply to you.
        </p>
      </div>
    ),
  },
  {
    id: "changes-terms",
    title: "Changes to Terms",
    icon: <RefreshCw className="w-5 h-5" />,
    content: (
      <div className="space-y-4">
        <div className="bg-[#495E57]/5 p-4 rounded-lg border border-[#495E57]/10">
          <h3 className="font-medium text-[#45474B] mb-2">
            Modification Process:
          </h3>
          <ul className="space-y-2 text-[#45474B]/70" role="list">
            {[
              "We may update these terms periodically",
              "Changes will be posted on this page",
              "Continued use constitutes acceptance",
              "Material changes may include additional notice",
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <span
                  className="w-2 h-2 bg-[#F4CE14] rounded-full mt-2 mr-3 shrink-0"
                  aria-hidden="true"
                ></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-[#45474B]/70">
          We recommend reviewing these terms regularly to stay informed of
          updates.
        </p>
      </div>
    ),
  },
  {
    id: "contact",
    title: "Contact Us",
    icon: <Mail className="w-5 h-5" />,
    content: (
      <div className="space-y-4">
        <div className="bg-[#495E57]/5 p-4 rounded-lg border border-[#495E57]/10">
          <h3 className="font-medium text-[#45474B] mb-2">Have questions?</h3>
          <p className="text-[#45474B]/70 mb-3">
            For any inquiries about these Terms of Service, please contact:
          </p>
          <div className="flex items-center gap-2 text-[#495E57]">
            <Mail className="w-5 h-5" />
            <a
              href="mailto:support@mcms.com"
              className="hover:underline focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:ring-offset-2 rounded"
            >
              support@mcms.com
            </a>
          </div>
        </div>
        <p className="text-[#45474B]/50 text-sm">
          We typically respond to inquiries within 1-2 business days.
        </p>
      </div>
    ),
  },
];

const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [accepted, setAccepted] = useState(false);

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

  const handleAcceptTerms = useCallback(() => {
    setAccepted(true);
    // In a real application, you would save this to local storage or send to backend
    localStorage.setItem("termsAccepted", "true");
  }, []);

  // Memoized components
  const HeaderSection = useMemo(
    () => (
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-4 py-2 bg-[#495E57]/10 rounded-full text-[#495E57] font-medium mb-4">
          <Star size={16} className="text-[#F4CE14] mr-2" fill="#F4CE14" />
          Legal Agreement
        </div>
        <h1 className="text-4xl font-bold text-[#45474B] mb-4">
          CareCamp
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#495E57] to-[#F4CE14]">
            {" "}
            Terms of Service
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

  const TermsContent = useMemo(
    () => (
      <article
        className="lg:w-3/4 bg-white rounded-2xl shadow-sm border border-[#495E57]/10 overflow-hidden"
        itemScope
        itemType="https://schema.org/TermsOfService"
      >
        <div className="p-8">
          <meta itemProp="datePublished" content="2024-01-01" />
          <meta itemProp="dateModified" content="2025-07-30" />

          <div className="prose max-w-none">
            <p className="text-[#45474B]/70 mb-8 leading-relaxed">
              Welcome to CareCamp (Medical Camp Management System). By accessing
              or using our platform, you agree to comply with and be bound by
              these Terms of Service. Please read them carefully before using
              our services.
            </p>

            <div className="space-y-8">
              {SECTIONS.map(({ id, title, icon, content }) => (
                <section
                  key={id}
                  id={id}
                  className="border-b border-[#495E57]/10 last:border-b-0 pb-8 last:pb-0"
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
        </div>

        {/* Acceptance Section */}
        <div className="bg-[#495E57]/5 p-8 border-t border-[#495E57]/10">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-semibold text-[#45474B] mb-3">
              By using CareCamp, you acknowledge that:
            </h3>
            <ul
              className="space-y-2 text-[#45474B]/70 text-left mb-6"
              role="list"
            >
              {[
                "You have read and understood these Terms of Service",
                "You agree to be bound by these terms",
                "You are at least 18 years old or have guardian consent",
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span
                    className="w-2 h-2 bg-[#F4CE14] rounded-full mt-2 mr-3 shrink-0"
                    aria-hidden="true"
                  ></span>
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={handleAcceptTerms}
              disabled={accepted}
              className={`inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:ring-offset-2 group ${
                accepted
                  ? "bg-green-500 text-white cursor-not-allowed"
                  : "bg-gradient-to-r from-[#495E57] to-[#495E57]/90 text-white hover:shadow-lg"
              }`}
              aria-label={
                accepted ? "Terms accepted" : "Accept terms of service"
              }
            >
              {accepted ? "Terms Accepted" : "I Accept These Terms"}
              {!accepted && (
                <ArrowRight
                  className="ml-2 text-[#F4CE14] group-hover:translate-x-1 transition-transform duration-200"
                  aria-hidden="true"
                />
              )}
            </button>
            {accepted && (
              <p className="text-green-600 text-sm mt-3" role="alert">
                Thank you for accepting our Terms of Service.
              </p>
            )}
          </div>
        </div>
      </article>
    ),
    [activeSection, toggleSection, accepted, handleAcceptTerms],
  );

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#F5F7F8] to-white py-12 px-4 sm:px-6 lg:px-8"
      role="main"
      aria-label="Terms of Service"
    >
      <div className="max-w-6xl mx-auto">
        {HeaderSection}

        <div className="flex flex-col lg:flex-row gap-8">
          {TableOfContents}
          {TermsContent}
        </div>
      </div>
    </div>
  );
};

export default React.memo(TermsOfService);
