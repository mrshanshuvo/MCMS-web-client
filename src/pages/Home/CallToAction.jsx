import React from "react";
import { ArrowRight, Play, CheckCircle, Star } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="bg-gradient-to-br from-[#495E57] via-[#495E57]/90 to-[#45474B] text-white">
      <div className="max-w-5xl mx-auto text-center px-4 py-16">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Star size={16} className="text-[#F4CE14]" fill="#F4CE14" />
          Join MCMS Today
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight">
          Ready to Transform
          <span className="block bg-gradient-to-r from-[#F4CE14] to-[#F4CE14]/80 bg-clip-text text-transparent">
            Healthcare Delivery?
          </span>
        </h2>

        <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
          Join our network making healthcare accessible to underserved
          communities.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="bg-gradient-to-r from-[#F4CE14] to-[#F4CE14]/90 text-[#45474B] font-bold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl hover:shadow-[#F4CE14]/25 transition-all duration-300 flex items-center justify-center group">
            Start Your Journey
            <ArrowRight
              className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
              size={20}
            />
          </button>

          <button className="flex items-center justify-center px-8 py-3 border-2 border-white/30 rounded-lg backdrop-blur-sm hover:bg-white/10 hover:border-white/50 transition-all duration-300 font-medium group">
            <Play
              className="mr-2 group-hover:scale-110 transition-transform duration-300"
              size={18}
            />
            Schedule Demo
          </button>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-white/60">
          <div className="flex items-center">
            <CheckCircle size={16} className="text-[#F4CE14] mr-2" />
            No setup fees
          </div>
          <div className="flex items-center">
            <CheckCircle size={16} className="text-[#F4CE14] mr-2" />
            Free training
          </div>
          <div className="flex items-center">
            <CheckCircle size={16} className="text-[#F4CE14] mr-2" />
            24/7 support
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(CallToAction);
