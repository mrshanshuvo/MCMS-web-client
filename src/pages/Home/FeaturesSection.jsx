import React from 'react';
import { MapPin, Shield, Users, ChevronRight } from 'lucide-react';

const features = [
  {
    title: 'Real-time Camp Tracking',
    description: 'Advanced dashboard with live updates and comprehensive analytics.',
    icon: MapPin,
    color: 'from-blue-500 to-cyan-500',
    stats: '99.9% Uptime'
  },
  {
    title: 'Enterprise Security',
    description: 'Bank-grade encryption and HIPAA compliance for medical data.',
    icon: Shield,
    color: 'from-green-500 to-emerald-500',
    stats: 'ISO 27001 Certified'
  },
  {
    title: 'Smart Role Management',
    description: 'Customizable permissions for doctors, patients, and staff.',
    icon: Users,
    color: 'from-purple-500 to-pink-500',
    stats: '50+ Role Types'
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Modern Healthcare</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Built with cutting-edge technology to streamline medical camp operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-4`}>
                  <Icon className="text-white" size={24} />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>

                <p className="text-gray-600 mb-4">{feature.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {feature.stats}
                  </span>
                  <ChevronRight className="text-gray-400" size={18} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default React.memo(FeaturesSection);