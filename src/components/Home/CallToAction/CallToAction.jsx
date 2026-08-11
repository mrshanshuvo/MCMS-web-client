import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import familyDoctorImg from '../../../assets/young-family-with-protective-face-masks-talking-doctor-medical-clinic.jpg';

const CallToAction = () => {
  return (
    <section className="py-12 sm:py-16 bg-[#F5F7F8] dark:bg-slate-950 px-4 sm:px-6 transition-colors duration-200">
      <div className="max-w-6xl mx-auto rounded-3xl sm:rounded-[36px] overflow-hidden relative shadow-2xl min-h-[380px] sm:min-h-[440px] flex items-center">
        {/* Full Image Background */}
        <img
          src={familyDoctorImg}
          alt="Family consulting with doctor at medical clinic"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Subtle Dark Gradient Overlay for Crisp Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />

        {/* Foreground Content */}
        <div className="relative z-10 p-8 sm:p-14 lg:p-16 max-w-2xl space-y-8">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.15] drop-shadow-md">
            <span className="font-black">A healthier </span>
            <span className="font-light opacity-90">chapter</span>
            <br />
            <span className="font-black">starts at </span>
            <span className="text-[#F4CE14] font-black">CareCamp.</span>
          </h2>

          <div>
            <Link
              to="/available-camps"
              className="inline-flex items-center gap-3 bg-white text-slate-800 font-bold text-sm sm:text-base px-6 sm:px-7 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group/btn w-fit cursor-pointer"
              aria-label="Discover Medical Camps"
            >
              <span>Discover Camps</span>
              <div className="w-8 h-8 rounded-full bg-[#495E57] text-[#F4CE14] flex items-center justify-center group-hover/btn:translate-x-1 transition-transform duration-300">
                <ArrowRight size={16} />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(CallToAction);
