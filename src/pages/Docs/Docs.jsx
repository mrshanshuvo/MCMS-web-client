import React, { useMemo } from "react";
import {
  BookOpen,
  Users,
  ClipboardList,
  LayoutDashboard,
  CreditCard,
  BarChart2,
  Bell,
  Smartphone,
  Code,
  Globe,
  Github,
  HelpCircle,
  ArrowRight,
  Star,
} from "lucide-react";
import { Link } from "react-router";

// Constants for better maintainability
const FEATURES = [
  {
    icon: <ClipboardList className="w-6 h-6" />,
    title: "Camp Management",
    description:
      "Create, edit, and manage medical camps with comprehensive tools",
  },
  {
    icon: <CreditCard className="w-6 h-6" />,
    title: "Secure Payments",
    description: "Stripe integration for safe and reliable transactions",
  },
  {
    icon: <BarChart2 className="w-6 h-6" />,
    title: "Participant Analytics",
    description: "Dynamic charts and insights for better decision making",
  },
  {
    icon: <Bell className="w-6 h-6" />,
    title: "Real-time Updates",
    description: "Instant notifications for all critical actions",
  },
  {
    icon: <Smartphone className="w-6 h-6" />,
    title: "Responsive Design",
    description: "Optimized for all devices from mobile to desktop",
  },
  {
    icon: <LayoutDashboard className="w-6 h-6" />,
    title: "Role-based Dashboards",
    description: "Custom interfaces for organizers and participants",
  },
];

const LINKS = [
  {
    icon: <Globe className="w-5 h-5" />,
    title: "Live Website",
    url: "https://mcms-auth.firebaseapp.com/",
    ariaLabel: "Visit the live MCMS website",
  },
  {
    icon: <Github className="w-5 h-5" />,
    title: "Client Repository",
    url: "https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-mrshanshuvo",
    ariaLabel: "View client-side source code on GitHub",
  },
  {
    icon: <Github className="w-5 h-5" />,
    title: "Server Repository",
    url: "https://github.com/Programming-Hero-Web-Course4/b11a12-server-side-mrshanshuvo",
    ariaLabel: "View server-side source code on GitHub",
  },
];

const USER_ROLES = [
  {
    title: "Organizer",
    icon: <Users className="w-5 h-5" />,
    features: [
      "Create, manage, and monitor medical camps",
      "Track registrations and payment statuses",
      "View participant analytics and feedback",
      "Manage camp schedules and details",
    ],
  },
  {
    title: "Participant",
    icon: <Users className="w-5 h-5" />,
    features: [
      "Explore and register for medical camps",
      "Make secure payments through Stripe",
      "Provide feedback on attended camps",
      "View personal registration history",
    ],
  },
];

const PROJECT_STRUCTURE = [
  {
    title: "Client",
    icon: <Code className="w-5 h-5" />,
    technologies: [
      "React with Vite",
      "TailwindCSS for styling",
      "React Router for navigation",
      "TanStack Query for data fetching",
      "Stripe JS for payments",
      "React Hook Form for forms",
    ],
  },
  {
    title: "Server",
    icon: <Code className="w-5 h-5" />,
    technologies: [
      "Node.js with Express",
      "MongoDB with Mongoose",
      "JWT for authentication",
      "Firebase Admin SDK",
      "Stripe for payment processing",
      "CORS and security middleware",
    ],
  },
];

const Docs = () => {
  // Memoized sections to prevent unnecessary re-renders
  const HeaderSection = useMemo(
    () => (
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-4 py-2 bg-[#495E57]/10 rounded-full text-[#495E57] font-medium mb-4">
          <Star size={16} className="text-[#F4CE14] mr-2" fill="#F4CE14" />
          Technical Documentation
        </div>
        <h1 className="text-4xl font-bold text-[#45474B] mb-4">
          MCMS
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#495E57] to-[#F4CE14]">
            {" "}
            Documentation
          </span>
        </h1>
        <p className="text-xl text-[#45474B]/70 max-w-3xl mx-auto leading-relaxed">
          Everything you need to know about the Medical Camp Management System
        </p>
      </div>
    ),
    []
  );

  const OverviewSection = useMemo(
    () => (
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[#45474B] mb-6 flex items-center">
          <span
            className="w-3 h-3 bg-[#495E57] rounded-full mr-3"
            aria-hidden="true"
          ></span>
          Overview
        </h2>
        <div className="prose max-w-none text-[#45474B]/70 leading-relaxed">
          <p>
            MCMS (Medical Camp Management System) is a full-featured MERN stack
            platform that simplifies the organization and participation of
            medical camps. It provides role-based dashboards, real-time updates,
            secure payments, and a user-centric interface for both organizers
            and participants.
          </p>
        </div>
      </section>
    ),
    []
  );

  const UserRolesSection = useMemo(
    () => (
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[#45474B] mb-6 flex items-center">
          <span
            className="w-3 h-3 bg-[#495E57] rounded-full mr-3"
            aria-hidden="true"
          ></span>
          User Roles
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {USER_ROLES.map((role) => (
            <div
              key={role.title}
              className="bg-[#495E57]/5 p-6 rounded-xl border border-[#495E57]/10 hover:shadow-sm transition-all duration-200"
            >
              <h3 className="font-semibold text-lg text-[#45474B] mb-4 flex items-center">
                <span className="text-[#495E57] mr-3" aria-hidden="true">
                  {role.icon}
                </span>
                {role.title}
              </h3>
              <ul className="space-y-2 text-[#45474B]/70" role="list">
                {role.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <span
                      className="w-2 h-2 bg-[#F4CE14] rounded-full mt-2 mr-3 shrink-0"
                      aria-hidden="true"
                    ></span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    ),
    []
  );

  const FeaturesSection = useMemo(
    () => (
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[#45474B] mb-6 flex items-center">
          <span
            className="w-3 h-3 bg-[#495E57] rounded-full mr-3"
            aria-hidden="true"
          ></span>
          Key Features
        </h2>
        <div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          role="list"
          aria-label="Key features"
        >
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-xl border border-[#495E57]/10 hover:shadow-md transition-all duration-200 group"
              role="listitem"
            >
              <div className="flex items-start space-x-4">
                <div className="bg-[#495E57]/10 p-2 rounded-lg text-[#495E57] group-hover:scale-110 transition-transform duration-200">
                  {feature.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#45474B] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[#45474B]/70 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    ),
    []
  );

  const ProjectStructureSection = useMemo(
    () => (
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[#45474B] mb-6 flex items-center">
          <span
            className="w-3 h-3 bg-[#495E57] rounded-full mr-3"
            aria-hidden="true"
          ></span>
          Project Structure
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {PROJECT_STRUCTURE.map((project) => (
            <div
              key={project.title}
              className="bg-[#495E57]/5 p-6 rounded-xl border border-[#495E57]/10 hover:shadow-sm transition-all duration-200"
            >
              <h3 className="font-semibold text-lg text-[#45474B] mb-4 flex items-center">
                <span className="text-[#495E57] mr-3" aria-hidden="true">
                  {project.icon}
                </span>
                {project.title}
              </h3>
              <ul className="space-y-2 text-[#45474B]/70" role="list">
                {project.technologies.map((tech, index) => (
                  <li key={index} className="flex items-start">
                    <span
                      className="w-2 h-2 bg-[#F4CE14] rounded-full mt-2 mr-3 shrink-0"
                      aria-hidden="true"
                    ></span>
                    <span>{tech}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    ),
    []
  );

  const LinksSection = useMemo(
    () => (
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-[#45474B] mb-6 flex items-center">
          <span
            className="w-3 h-3 bg-[#495E57] rounded-full mr-3"
            aria-hidden="true"
          ></span>
          Useful Links
        </h2>
        <div className="space-y-3" role="list" aria-label="Useful links">
          {LINKS.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-4 bg-white rounded-lg border border-[#495E57]/10 hover:shadow-md transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:ring-offset-2"
              aria-label={link.ariaLabel}
            >
              <div className="mr-4 text-[#495E57] group-hover:scale-110 transition-transform duration-200">
                {link.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-[#45474B]">{link.title}</h3>
                <p className="text-sm text-[#45474B]/50 truncate">{link.url}</p>
              </div>
              <ArrowRight
                className="ml-2 text-[#F4CE14] group-hover:translate-x-1 transition-transform duration-200"
                size={18}
                aria-hidden="true"
              />
            </a>
          ))}
        </div>
      </section>
    ),
    []
  );

  const SupportSection = useMemo(
    () => (
      <section>
        <h2 className="text-2xl font-semibold text-[#45474B] mb-6 flex items-center">
          <span
            className="w-3 h-3 bg-[#495E57] rounded-full mr-3"
            aria-hidden="true"
          ></span>
          Need Help?
        </h2>
        <div className="bg-[#495E57]/5 p-6 rounded-xl border border-[#495E57]/10">
          <div className="flex items-start space-x-4">
            <div className="bg-[#495E57]/10 p-3 rounded-full text-[#495E57] shrink-0">
              <HelpCircle size={24} aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-[#45474B] mb-2">
                Contact Support
              </h3>
              <p className="text-[#45474B]/70 mb-4 leading-relaxed">
                If you encounter issues or have questions about the platform,
                feel free to reach out through our contact form or open an issue
                on GitHub.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-[#495E57] to-[#495E57]/90 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:ring-offset-2 group"
                aria-label="Contact our support team"
              >
                Contact Us
                <ArrowRight
                  className="ml-2 group-hover:translate-x-1 transition-transform duration-200"
                  size={18}
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    ),
    []
  );

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#F5F7F8] to-white py-16 px-4 sm:px-6 lg:px-8"
      role="main"
      aria-label="Documentation"
    >
      <div className="max-w-6xl mx-auto">
        {HeaderSection}

        {/* Documentation Content */}
        <div
          className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#495E57]/10"
          itemScope
          itemType="https://schema.org/TechArticle"
        >
          <div className="p-8 sm:p-10 lg:p-12">
            <meta itemProp="headline" content="MCMS Documentation" />
            <meta
              itemProp="description"
              content="Technical documentation for Medical Camp Management System"
            />

            {OverviewSection}
            {UserRolesSection}
            {FeaturesSection}
            {ProjectStructureSection}
            {LinksSection}
            {SupportSection}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Docs);
