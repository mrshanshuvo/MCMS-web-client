import React from 'react';
import { ArrowRight, Play, CheckCircle } from 'lucide-react';

const CallToAction = () => {
  return (
    <section className="bg-gradient-to-br from-[#1e3a8a] via-[#2B6CB0] to-[#0f766e] text-white">
      <div className="max-w-5xl mx-auto text-center px-4 py-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight">
          Ready to Transform
          <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Healthcare Delivery?
          </span>
        </h2>

        <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
          Join our network making healthcare accessible to underserved communities.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-bold px-8 py-3 rounded-lg shadow-lg hover:shadow-yellow-400/25 transition-all flex items-center justify-center">
            Start Your Journey
            <ArrowRight className="ml-2" size={20} />
          </button>

          <button className="flex items-center justify-center px-8 py-3 border-2 border-white/30 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-all font-medium">
            <Play className="mr-2" size={18} />
            Schedule Demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default React.memo(CallToAction);