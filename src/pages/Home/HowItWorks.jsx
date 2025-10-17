import React, { useState } from "react";
import { CheckCircle, Star } from "lucide-react";

const steps = [
  {
    title: "Create Your Profile",
    description: "Register with verified credentials and choose your role.",
    details: "Complete KYC verification in under 2 minutes",
  },
  {
    title: "Discover Opportunities",
    description: "Browse our database of medical camps with advanced filters.",
    details: "AI-powered recommendations",
  },
  {
    title: "Make an Impact",
    description: "Connect with your community through healthcare initiatives.",
    details: "Real-time impact tracking",
  },
];

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-16 bg-gradient-to-b from-[#F5F7F8] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#495E57]/10 text-[#495E57] px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Star size={16} className="text-[#F4CE14]" fill="#F4CE14" />
            How It Works
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#45474B] mb-4">
            Simple Process,
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#495E57] to-[#F4CE14]">
              {" "}
              Powerful Results
            </span>
          </h2>
          <p className="text-lg text-[#45474B]/70 max-w-2xl mx-auto">
            Get started in minutes and join thousands of healthcare
            professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl border-2 transition-all duration-300 group cursor-pointer ${
                activeStep === index
                  ? "border-[#495E57] bg-[#495E57]/5 shadow-md"
                  : "border-[#495E57]/10 bg-white hover:border-[#495E57]/30 hover:shadow-sm"
              }`}
              onMouseEnter={() => setActiveStep(index)}
            >
              <div className="flex items-center mb-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-all duration-300 ${
                    activeStep === index
                      ? "bg-gradient-to-r from-[#495E57] to-[#495E57]/90 text-white shadow-sm"
                      : "bg-[#495E57]/10 text-[#45474B] group-hover:bg-[#495E57]/20"
                  }`}
                >
                  {index + 1}
                </div>
              </div>

              <h3
                className={`text-xl font-bold mb-3 transition-colors duration-300 ${
                  activeStep === index ? "text-[#495E57]" : "text-[#45474B]"
                }`}
              >
                {step.title}
              </h3>

              <p className="text-[#45474B]/70 mb-4 leading-relaxed">
                {step.description}
              </p>

              <div
                className={`flex items-center text-sm transition-colors duration-300 ${
                  activeStep === index ? "text-[#495E57]" : "text-[#45474B]/60"
                }`}
              >
                <CheckCircle
                  size={16}
                  className={`mr-2 transition-colors duration-300 ${
                    activeStep === index
                      ? "text-[#F4CE14]"
                      : "text-[#495E57]/60"
                  }`}
                />
                {step.details}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(HowItWorks);
