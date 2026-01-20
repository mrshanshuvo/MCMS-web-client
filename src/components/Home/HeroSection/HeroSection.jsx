import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, Play, Users, Heart, TrendingUp, X } from "lucide-react";
import { Link } from "react-router";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // close on ESC + lock scroll
  useEffect(() => {
    if (!showDemo) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setShowDemo(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [showDemo]);

  const gridPattern = useMemo(
    () =>
      encodeURIComponent(
        `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 20h40M20 0v40" stroke="rgba(73, 94, 87, 0.05)" stroke-width="1"/>
        </svg>`,
      ),
    [],
  );

  return (
    <section className="relative bg-[#F5F7F8] overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-100"
        style={{ backgroundImage: `url("data:image/svg+xml,${gridPattern}")` }}
        aria-hidden="true"
      />
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#F4CE14]/10 to-transparent rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#495E57]/5 rounded-full blur-3xl"
        aria-hidden="true"
      />

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div
            className={`lg:col-span-12 space-y-8 transition-all duration-1000 ease-out ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-12 opacity-0"
            }`}
          >
            {/* Mini Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#495E57] rounded-full">
              <div className="flex -space-x-2" aria-hidden="true">
                {["👨", "👩", "👨"].map((icon, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full bg-[#F4CE14] border-2 border-[#495E57] flex items-center justify-center text-xs"
                  >
                    {icon}
                  </div>
                ))}
              </div>
              <span className="text-sm font-medium text-[#F5F7F8]">
                10,000+ professionals trust us
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] text-[#45474B]">
                Empowering Healthcare
                <span className="block relative mt-2">
                  <span
                    className="absolute -bottom-2 left-0 w-full h-4 bg-[#F4CE14] -z-0 transform -skew-y-1"
                    aria-hidden="true"
                  />
                </span>
                <span className="block mt-3 text-[#495E57]">Communities</span>
              </h1>

              <p className="text-xl lg:text-2xl text-[#45474B]/70 leading-relaxed max-w-2xl">
                Connect, organize, and deliver healthcare where it matters most.
                CareCamp brings medical camps to life with seamless coordination
                and real impact.
              </p>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-8 pt-2">
              {[
                {
                  icon: <Users size={24} className="text-[#F4CE14]" />,
                  title: "Easy Coordination",
                  subtitle: "Unified platform",
                },
                {
                  icon: <Heart size={24} className="text-[#F4CE14]" />,
                  title: "Patient Focus",
                  subtitle: "Care-first approach",
                },
                {
                  icon: <TrendingUp size={24} className="text-[#F4CE14]" />,
                  title: "Proven Results",
                  subtitle: "Data-driven insights",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#495E57] flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-[#45474B]">
                      {item.title}
                    </div>
                    <div className="text-sm text-[#45474B]/60">
                      {item.subtitle}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              {/* Link styled as button (no nested button) */}
              <Link
                to="/available-camps"
                className="group relative bg-[#495E57] text-[#F5F7F8] font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Explore Medical Camps
                  <ArrowRight
                    className="ml-2 group-hover:translate-x-2 transition-transform duration-300"
                    size={20}
                    aria-hidden="true"
                  />
                </span>
                <span className="absolute inset-0 bg-[#45474B] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>

              <button
                type="button"
                onClick={() => setShowDemo(true)}
                className="relative group flex items-center justify-center px-8 py-4 border-2 border-[#495E57] text-[#495E57] rounded-xl hover:bg-[#495E57] hover:text-[#F5F7F8] transition-all duration-300 overflow-hidden cursor-pointer"
              >
                <span
                  className="absolute inset-0 rounded-xl bg-[#495E57]/10 group-hover:animate-ping"
                  aria-hidden="true"
                />
                <Play
                  className="mr-2 relative z-10 group-hover:scale-110 transition-transform duration-300"
                  size={20}
                  aria-hidden="true"
                />
                <span className="font-medium relative z-10">Watch Demo</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Modal */}
      {showDemo && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowDemo(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-label="CareCamp demo video"
        >
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl relative overflow-hidden animate-[fadeIn_0.2s_ease-out]">
            <button
              type="button"
              onClick={() => setShowDemo(false)}
              className="absolute top-4 right-4 bg-[#495E57] text-white p-2 rounded-full hover:bg-[#F4CE14] hover:text-[#45474B] transition"
              aria-label="Close demo"
            >
              <X size={20} aria-hidden="true" />
            </button>

            <div className="aspect-video">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/jX3s9Dlh2kc"
                title="CareCamp Demo Video"
                allow="autoplay; fullscreen"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>

          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(8px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}
    </section>
  );
};

export default React.memo(HeroSection);
