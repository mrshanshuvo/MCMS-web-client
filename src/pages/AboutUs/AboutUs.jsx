import React, { useMemo } from "react";
import {
  HeartPulse,
  Stethoscope,
  Users,
  CalendarCheck,
  ShieldCheck,
  ArrowRight,
  Star,
} from "lucide-react";
import { Link } from "react-router";

// Constants
const FEATURES = [
  {
    icon: <CalendarCheck className="w-8 h-8" />,
    title: "Camp Management",
    description:
      "Efficiently organize and schedule medical camps with our comprehensive tools",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Participant Engagement",
    description:
      "Connect with communities and maximize participation through our platform",
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "Secure Registration",
    description:
      "Protected sign-up process with verified medical professional participation",
  },
  {
    icon: <Stethoscope className="w-8 h-8" />,
    title: "Healthcare Access",
    description: "Bridge the gap between providers and underserved communities",
  },
];

const STATS = [
  { number: "250+", label: "Camps Organized" },
  { number: "5,000+", label: "Participants Served" },
  { number: "100+", label: "Healthcare Partners" },
  { number: "24/7", label: "Support Available" },
];

const AboutUs = () => {
  // Memoized components
  const HeaderSection = useMemo(
    () => (
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-4 py-2 bg-[#495E57]/10 rounded-full text-[#495E57] font-medium mb-4">
          <Star size={16} className="text-[#F4CE14] mr-2" fill="#F4CE14" />
          About Our Platform
        </div>
        <h1 className="text-4xl font-bold text-[#45474B] mb-4">
          Medical Camp Management System
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#495E57] to-[#F4CE14]">
            {" "}
            (CareCamp)
          </span>
        </h1>
        <p className="text-xl text-[#45474B]/70 max-w-3xl mx-auto leading-relaxed">
          Revolutionizing how medical camps are organized and accessed
        </p>
      </div>
    ),
    [],
  );

  const MainContent = useMemo(
    () => (
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#495E57]/10">
        <div className="grid md:grid-cols-2">
          {/* Text Content */}
          <div className="p-8 sm:p-10 lg:p-12">
            <div className="space-y-6 text-[#45474B]/70 text-lg leading-relaxed">
              <p className="text-xl text-[#45474B] font-medium">
                CareCamp is a comprehensive platform designed to streamline the
                planning, management, and participation of medical camps. It
                empowers organizers to efficiently coordinate events while
                providing participants with an intuitive interface to discover
                and join camps that matter.
              </p>
              <p>
                With real-time updates, secure registration, transparent payment
                tracking, and actionable feedback, CareCamp ensures every
                medical camp runs smoothly, maximizes impact, and fosters a
                healthier community.
              </p>
              <p className="font-medium text-[#45474B]">
                Our mission is to bridge the gap between healthcare providers
                and communities in need by leveraging technology that is simple,
                reliable, and accessible to all.
              </p>
            </div>

            <div className="mt-10">
              <Link
                to="/available-camps"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#495E57] to-[#495E57]/90 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#495E57] focus:ring-offset-2"
                aria-label="Explore available medical camps"
              >
                Explore Available Camps
                <ArrowRight
                  className="ml-2 text-[#F4CE14] transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="bg-gradient-to-br from-[#495E57]/5 to-[#F4CE14]/5 p-8 sm:p-10 lg:p-12 border-t md:border-t-0 md:border-l border-[#495E57]/10">
            <h2 className="text-2xl font-semibold text-[#45474B] mb-6">
              Key Features
            </h2>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
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
          </div>
        </div>
      </div>
    ),
    [],
  );

  const StatsSection = useMemo(
    () => (
      <div
        className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
        role="region"
        aria-label="Platform statistics"
      >
        {STATS.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-[#495E57]/10 text-center hover:shadow-md transition-all duration-200"
          >
            <p
              className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#495E57] to-[#F4CE14]"
              aria-label={`${stat.number} ${stat.label}`}
            >
              {stat.number}
            </p>
            <p className="text-[#45474B]/70 mt-2 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>
    ),
    [],
  );

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#F5F7F8] to-white py-16 px-4 sm:px-6 lg:px-8"
      role="main"
      aria-label="About CareCamp"
    >
      <div className="max-w-7xl mx-auto">
        {HeaderSection}
        {MainContent}
        {StatsSection}
      </div>
    </div>
  );
};

export default React.memo(AboutUs);
