import React, { useState, useEffect } from 'react';
import { ArrowRight, Play, Star, CheckCircle } from 'lucide-react';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const dotPattern = encodeURIComponent(
    `<svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
      <circle cx="15" cy="15" r="1" fill="white" fill-opacity="0.1"/>
    </svg>`
  );

  return (
    <section className="relative bg-gradient-to-br from-[#1e3a8a] via-[#3A7CA5] to-[#0f766e] text-white overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{ backgroundImage: `url("data:image/svg+xml,${dotPattern}")` }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className={`space-y-6 transition-all duration-700 ease-out ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              Trusted by 10,000+ healthcare professionals
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Empowering
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Healthcare
              </span>
              Communities
            </h1>

            <p className="text-lg lg:text-xl text-blue-100 leading-relaxed">
              Join MCMS to organize, manage, and participate in medical camps across the nation.
              <span className="font-semibold text-white"> Simplified. Secure. Scalable.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 flex items-center justify-center">
                Explore Medical Camps
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </button>

              <button className="group flex items-center justify-center px-6 py-3 border-2 border-white/30 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                <Play className="mr-2 group-hover:scale-110 transition-transform" size={18} />
                Watch Demo
              </button>
            </div>
          </div>

          <div className={`relative transition-all duration-700 ease-out delay-150 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-6xl">
                🏥
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <span className="text-sm">Active Camps</span>
                  <span className="text-green-400 font-bold">127</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <span className="text-sm">Patients Served</span>
                  <span className="text-blue-400 font-bold">45,230</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(HeroSection);