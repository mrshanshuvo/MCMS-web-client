import React from "react";
import { MapPin, Shield, Users, ChevronRight, Star } from "lucide-react";

const features = [
  {
    title: "Real-time Camp Tracking",
    description:
      "Advanced dashboard with live updates and comprehensive analytics.",
    icon: MapPin,
    stats: "99.9% Uptime",
  },
  {
    title: "Enterprise Security",
    description: "Bank-grade encryption and HIPAA compliance for medical data.",
    icon: Shield,
    stats: "ISO 27001 Certified",
  },
  {
    title: "Smart Role Management",
    description: "Customizable permissions for doctors, patients, and staff.",
    icon: Users,
    stats: "50+ Role Types",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-[#F5F7F8] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#495E57]/10 text-[#495E57] px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Star
              size={16}
              className="text-[#F4CE14]"
              fill="#F4CE14"
              aria-hidden="true"
            />
            Why Choose CareCamp
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-[#45474B] mb-4">
            Powerful Features for
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#495E57] to-[#F4CE14]">
              {" "}
              Modern Healthcare
            </span>
          </h2>

          <p className="text-lg text-[#45474B]/70 max-w-3xl mx-auto">
            Built with cutting-edge technology to streamline medical camp
            operations.
          </p>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <li
                key={feature.title}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-[#495E57]/10 group"
              >
                <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-[#495E57] to-[#495E57]/80 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="text-white" size={24} aria-hidden="true" />
                </div>

                <h3 className="text-xl font-bold text-[#45474B] mb-3">
                  {feature.title}
                </h3>

                <p className="text-[#45474B]/70 mb-4 leading-relaxed">
                  {feature.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#45474B] bg-[#F4CE14]/20 px-3 py-1 rounded-full">
                    {feature.stats}
                  </span>
                  <ChevronRight
                    className="text-[#495E57] group-hover:translate-x-1 transition-transform duration-300"
                    size={18}
                    aria-hidden="true"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default React.memo(FeaturesSection);
