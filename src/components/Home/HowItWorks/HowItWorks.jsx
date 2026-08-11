import React, { useState } from 'react';
import { CheckCircle, Workflow } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const steps = [
  {
    title: 'Create Your Profile',
    description: 'Register with verified credentials and choose your role.',
    details: 'Complete KYC verification in under 2 minutes',
  },
  {
    title: 'Discover Opportunities',
    description: 'Browse our database of medical camps with advanced filters.',
    details: 'AI-powered recommendations',
  },
  {
    title: 'Make an Impact',
    description: 'Connect with your community through healthcare initiatives.',
    details: 'Real-time impact tracking',
  },
];

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="bg-[#F5F7F8] dark:bg-slate-950 py-16 sm:py-20 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Minimalist Header Line */}
        <div className="flex items-end justify-between pb-3 mb-10 border-b border-slate-300/70 dark:border-slate-800">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 transition-colors">
            <Workflow size={20} className="text-[#F4CE14]" aria-hidden="true" />
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#495E57] dark:text-slate-100">
              How CareCamp Works
            </span>
          </div>

          <div className="hidden sm:block text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            3 Simple Steps to Get Started
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const isActive = activeStep === index;

            return (
              <button
                key={step.title}
                type="button"
                onMouseEnter={() => setActiveStep(index)}
                onFocus={() => setActiveStep(index)}
                onClick={() => setActiveStep(index)}
                aria-pressed={isActive}
                className="text-left cursor-pointer focus:outline-none w-full"
              >
                <Card
                  className={`p-6 rounded-3xl border-2 transition-all duration-300 group h-full flex flex-col justify-between ${
                    isActive
                      ? 'border-[#495E57] dark:border-[#F4CE14] bg-white dark:bg-slate-900 shadow-xl'
                      : 'border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 hover:shadow-md'
                  }`}
                >
                  <CardContent className="p-0 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                          isActive
                            ? 'bg-[#495E57] dark:bg-[#F4CE14] text-white dark:text-slate-950 shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                        aria-hidden="true"
                      >
                        0{index + 1}
                      </div>

                      {isActive && (
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#495E57] dark:text-[#F4CE14] bg-[#F4CE14]/15 dark:bg-[#F4CE14]/10 px-2.5 py-0.5 rounded-full">
                          Active Step
                        </span>
                      )}
                    </div>

                    <h3
                      className={`text-xl font-bold transition-colors duration-300 ${
                        isActive
                          ? 'text-[#495E57] dark:text-[#F4CE14]'
                          : 'text-slate-800 dark:text-slate-100'
                      }`}
                    >
                      {step.title}
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>

                  <div className="flex items-center text-xs font-medium pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4 text-slate-600 dark:text-slate-400">
                    <CheckCircle
                      size={15}
                      className={`mr-2 flex-shrink-0 transition-colors duration-300 ${
                        isActive ? 'text-[#F4CE14]' : 'text-slate-400 dark:text-slate-600'
                      }`}
                      aria-hidden="true"
                    />
                    <span>{step.details}</span>
                  </div>
                </Card>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default React.memo(HowItWorks);
