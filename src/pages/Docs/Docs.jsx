import React from "react";
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
} from "lucide-react";

const Docs = () => {
  const features = [
    {
      icon: <ClipboardList className="w-6 h-6 text-blue-600" />,
      title: "Camp Management",
      description:
        "Create, edit, and manage medical camps with comprehensive tools",
    },
    {
      icon: <CreditCard className="w-6 h-6 text-purple-600" />,
      title: "Secure Payments",
      description: "Stripe integration for safe and reliable transactions",
    },
    {
      icon: <BarChart2 className="w-6 h-6 text-teal-600" />,
      title: "Participant Analytics",
      description: "Dynamic charts and insights for better decision making",
    },
    {
      icon: <Bell className="w-6 h-6 text-amber-600" />,
      title: "Real-time Updates",
      description: "Instant notifications for all critical actions",
    },
    {
      icon: <Smartphone className="w-6 h-6 text-indigo-600" />,
      title: "Responsive Design",
      description: "Optimized for all devices from mobile to desktop",
    },
    {
      icon: <LayoutDashboard className="w-6 h-6 text-green-600" />,
      title: "Role-based Dashboards",
      description: "Custom interfaces for organizers and participants",
    },
  ];

  const links = [
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Live Website",
      url: "https://mcms-auth.firebaseapp.com/",
      color: "text-blue-600",
    },
    {
      icon: <Github className="w-5 h-5" />,
      title: "Client Repository",
      url: "https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-mrshanshuvo",
      color: "text-purple-600",
    },
    {
      icon: <Github className="w-5 h-5" />,
      title: "Server Repository",
      url: "https://github.com/Programming-Hero-Web-Course4/b11a12-server-side-mrshanshuvo",
      color: "text-teal-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f9ff] to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 font-medium mb-4">
            <BookOpen className="mr-2" size={20} />
            Technical Documentation
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            MCMS
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}
              Documentation
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about the Medical Camp Management System
          </p>
        </div>

        {/* Documentation Content */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8 sm:p-10 lg:p-12">
            {/* Overview */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="w-3 h-3 bg-blue-600 rounded-full mr-3"></span>
                Overview
              </h2>
              <div className="prose max-w-none text-gray-700">
                <p>
                  MCMS (Medical Camp Management System) is a full-featured MERN
                  stack platform that simplifies the organization and
                  participation of medical camps. It provides role-based
                  dashboards, real-time updates, secure payments, and a
                  user-centric interface for both organizers and participants.
                </p>
              </div>
            </section>

            {/* User Roles */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="w-3 h-3 bg-purple-600 rounded-full mr-3"></span>
                User Roles
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                  <h3 className="font-semibold text-lg text-gray-800 mb-3 flex items-center">
                    <Users className="text-blue-600 mr-2" size={20} />
                    Organizer
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Create, manage, and monitor medical camps</li>
                    <li>Track registrations and payment statuses</li>
                    <li>View participant analytics and feedback</li>
                    <li>Manage camp schedules and details</li>
                  </ul>
                </div>
                <div className="bg-purple-50/50 p-5 rounded-xl border border-purple-100">
                  <h3 className="font-semibold text-lg text-gray-800 mb-3 flex items-center">
                    <Users className="text-purple-600 mr-2" size={20} />
                    Participant
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Explore and register for medical camps</li>
                    <li>Make secure payments through Stripe</li>
                    <li>Provide feedback on attended camps</li>
                    <li>View personal registration history</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Key Features */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="w-3 h-3 bg-teal-600 rounded-full mr-3"></span>
                Key Features
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Project Structure */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="w-3 h-3 bg-amber-600 rounded-full mr-3"></span>
                Project Structure
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                  <h3 className="font-semibold text-lg text-gray-800 mb-3 flex items-center">
                    <Code className="text-gray-600 mr-2" size={20} />
                    Client
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>React with Vite</li>
                    <li>TailwindCSS for styling</li>
                    <li>React Router for navigation</li>
                    <li>TanStack Query for data fetching</li>
                    <li>Stripe JS for payments</li>
                    <li>React Hook Form for forms</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                  <h3 className="font-semibold text-lg text-gray-800 mb-3 flex items-center">
                    <Code className="text-gray-600 mr-2" size={20} />
                    Server
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Node.js with Express</li>
                    <li>MongoDB with Mongoose</li>
                    <li>JWT for authentication</li>
                    <li>Firebase Admin SDK</li>
                    <li>Stripe for payment processing</li>
                    <li>CORS and security middleware</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Useful Links */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="w-3 h-3 bg-green-600 rounded-full mr-3"></span>
                Useful Links
              </h2>
              <div className="space-y-3">
                {links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all ${link.color}`}
                  >
                    <div className="mr-4">{link.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-medium">{link.title}</h3>
                      <p className="text-sm text-gray-500 truncate">
                        {link.url}
                      </p>
                    </div>
                    <ArrowRight className="ml-2" size={18} />
                  </a>
                ))}
              </div>
            </section>

            {/* Support */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="w-3 h-3 bg-red-600 rounded-full mr-3"></span>
                Need Help?
              </h2>
              <div className="bg-red-50/50 p-6 rounded-xl border border-red-100">
                <div className="flex items-start space-x-4">
                  <div className="bg-red-100 p-3 rounded-full">
                    <HelpCircle className="text-red-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      Contact Support
                    </h3>
                    <p className="text-gray-700 mb-4">
                      If you encounter issues or have questions about the
                      platform, feel free to reach out through our contact form
                      or open an issue on GitHub.
                    </p>
                    <button
                      onClick={() => (window.location.href = "/contact")}
                      className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                    >
                      Contact Us
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docs;
