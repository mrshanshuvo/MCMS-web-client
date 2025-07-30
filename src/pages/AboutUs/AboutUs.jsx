import React from "react";
import {
  HeartPulse,
  Stethoscope,
  Users,
  CalendarCheck,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const AboutUs = () => {
  const features = [
    {
      icon: <CalendarCheck className="w-8 h-8 text-blue-600" />,
      title: "Camp Management",
      description:
        "Efficiently organize and schedule medical camps with our comprehensive tools",
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Participant Engagement",
      description:
        "Connect with communities and maximize participation through our platform",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-teal-600" />,
      title: "Secure Registration",
      description:
        "Protected sign-up process with verified medical professional participation",
    },
    {
      icon: <Stethoscope className="w-8 h-8 text-indigo-600" />,
      title: "Healthcare Access",
      description:
        "Bridge the gap between providers and underserved communities",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f9ff] to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 font-medium mb-4">
            <HeartPulse className="mr-2" size={20} />
            About Our Platform
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Medical Camp Management System
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}
              (MCMS)
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Revolutionizing how medical camps are organized and accessed
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="grid md:grid-cols-2">
            {/* Text Content */}
            <div className="p-8 sm:p-10 lg:p-12">
              <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                <p className="text-xl text-gray-800">
                  MCMS is a comprehensive platform designed to streamline the
                  planning, management, and participation of medical camps. It
                  empowers organizers to efficiently coordinate events while
                  providing participants with an intuitive interface to discover
                  and join camps that matter.
                </p>
                <p>
                  With real-time updates, secure registration, transparent
                  payment tracking, and actionable feedback, MCMS ensures every
                  medical camp runs smoothly, maximizes impact, and fosters a
                  healthier community.
                </p>
                <p className="font-medium text-gray-900">
                  Our mission is to bridge the gap between healthcare providers
                  and communities in need by leveraging technology that is
                  simple, reliable, and accessible to all.
                </p>
              </div>

              <div className="mt-10">
                <button
                  onClick={() => (window.location.href = "/available-camps")}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all group"
                  aria-label="Explore Available Camps"
                >
                  Explore Available Camps
                  <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Features Grid */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 sm:p-10 lg:p-12">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                Key Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                        <h4 className="font-semibold text-gray-900">
                          {feature.title}
                        </h4>
                        <p className="text-gray-600 text-sm mt-1">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { number: "250+", label: "Camps Organized" },
            { number: "5,000+", label: "Participants Served" },
            { number: "100+", label: "Healthcare Partners" },
            { number: "24/7", label: "Support Available" },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center"
            >
              <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {stat.number}
              </p>
              <p className="text-gray-600 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
