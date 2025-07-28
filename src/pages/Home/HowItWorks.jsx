import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

const steps = [
  {
    title: "Create Your Profile",
    description: "Register with verified credentials and choose your role.",
    details: "Complete KYC verification in under 2 minutes"
  },
  {
    title: "Discover Opportunities",
    description: "Browse our database of medical camps with advanced filters.",
    details: "AI-powered recommendations"
  },
  {
    title: "Make an Impact",
    description: "Connect with your community through healthcare initiatives.",
    details: "Real-time impact tracking"
  },
];

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Simple Process,
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Powerful Results</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get started in minutes and join thousands of healthcare professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl border-2 transition-all ${activeStep === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
              onMouseEnter={() => setActiveStep(index)}
            >
              <div className="flex items-center mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${activeStep === index ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {index + 1}
                </div>
              </div>

              <h3 className={`text-xl font-bold mb-3 ${activeStep === index ? 'text-blue-600' : 'text-gray-900'}`}>
                {step.title}
              </h3>

              <p className="text-gray-600 mb-4">
                {step.description}
              </p>

              <div className={`flex items-center text-sm ${activeStep === index ? 'text-blue-600' : 'text-gray-500'}`}>
                <CheckCircle size={16} className="mr-2" />
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