import React, { useState, useEffect } from "react";
import { ArrowRight, Play, Users, Heart, TrendingUp } from "lucide-react";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [statsAnimation, setStatsAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    const statsTimer = setTimeout(() => setStatsAnimation(true), 600);
    return () => {
      clearTimeout(timer);
      clearTimeout(statsTimer);
    };
  }, []);

  const gridPattern = encodeURIComponent(
    `<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 20h40M20 0v40" stroke="rgba(73, 94, 87, 0.05)" stroke-width="1"/>
    </svg>`
  );

  return (
    <section className="relative bg-[#F5F7F8] overflow-hidden">
      <div
        className="absolute inset-0 opacity-100"
        style={{ backgroundImage: `url("data:image/svg+xml,${gridPattern}")` }}
      />

      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#F4CE14]/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#495E57]/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div
            className={`lg:col-span-7 space-y-8 transition-all duration-1000 ease-out ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-12 opacity-0"
            }`}
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#495E57] rounded-full">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-[#F4CE14] border-2 border-[#495E57] flex items-center justify-center text-xs">
                  👨
                </div>
                <div className="w-6 h-6 rounded-full bg-[#F4CE14] border-2 border-[#495E57] flex items-center justify-center text-xs">
                  👩
                </div>
                <div className="w-6 h-6 rounded-full bg-[#F4CE14] border-2 border-[#495E57] flex items-center justify-center text-xs">
                  👨
                </div>
              </div>
              <span className="text-sm font-medium text-[#F5F7F8]">
                10,000+ professionals trust us
              </span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] text-[#45474B]">
                Empowering
                <span className="block relative mt-2">
                  <span className="relative z-10">Healthcare</span>
                  <div className="absolute -bottom-2 left-0 w-full h-4 bg-[#F4CE14] -z-0 transform -skew-y-1" />
                </span>
                <span className="block mt-3 text-[#495E57]">Communities</span>
              </h1>

              <p className="text-xl lg:text-2xl text-[#45474B]/70 leading-relaxed max-w-2xl">
                Connect, organize, and deliver healthcare where it matters most.
                MCMS brings medical camps to life with seamless coordination and
                real impact.
              </p>
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#495E57] flex items-center justify-center flex-shrink-0">
                  <Users size={20} className="text-[#F4CE14]" />
                </div>
                <div>
                  <div className="font-semibold text-[#45474B]">
                    Easy Coordination
                  </div>
                  <div className="text-sm text-[#45474B]/60">
                    Unified platform
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#495E57] flex items-center justify-center flex-shrink-0">
                  <Heart size={20} className="text-[#F4CE14]" />
                </div>
                <div>
                  <div className="font-semibold text-[#45474B]">
                    Patient Focus
                  </div>
                  <div className="text-sm text-[#45474B]/60">
                    Care-first approach
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#495E57] flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={20} className="text-[#F4CE14]" />
                </div>
                <div>
                  <div className="font-semibold text-[#45474B]">
                    Proven Results
                  </div>
                  <div className="text-sm text-[#45474B]/60">
                    Data-driven insights
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="group relative bg-[#495E57] text-[#F5F7F8] font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center overflow-hidden">
                <span className="relative z-10 flex items-center">
                  Explore Medical Camps
                  <ArrowRight
                    className="ml-2 group-hover:translate-x-2 transition-transform duration-300"
                    size={20}
                  />
                </span>
                <div className="absolute inset-0 bg-[#45474B] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>

              <button className="group flex items-center justify-center px-8 py-4 border-2 border-[#495E57] text-[#495E57] rounded-xl hover:bg-[#495E57] hover:text-[#F5F7F8] transition-all duration-300">
                <Play
                  className="mr-2 group-hover:scale-110 transition-transform duration-300"
                  size={20}
                />
                <span className="font-medium">Watch Demo</span>
              </button>
            </div>
          </div>

          <div
            className={`lg:col-span-5 transition-all duration-1000 ease-out delay-200 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-br from-[#F4CE14]/20 to-[#495E57]/10 rounded-3xl blur-2xl" />

              <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-[#495E57]/10">
                <div className="aspect-[4/3] bg-gradient-to-br from-[#495E57] to-[#45474B] rounded-2xl flex items-center justify-center text-7xl relative overflow-hidden shadow-inner">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjQ0LDIwNiwxNCwwLjEpIi8+PC9zdmc+')] opacity-30" />
                  <div className="absolute top-4 right-4 w-12 h-12 bg-[#F4CE14] rounded-full animate-pulse opacity-20" />
                  <div className="absolute bottom-6 left-6 w-16 h-16 bg-[#F4CE14] rounded-full animate-pulse opacity-10" />
                  <span className="relative z-10 drop-shadow-2xl filter brightness-110">
                    🏥
                  </span>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="bg-gradient-to-r from-[#F5F7F8] to-white p-6 rounded-2xl border-l-4 border-[#F4CE14] shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-[#495E57]/60 font-medium mb-1">
                          Active Camps
                        </div>
                        <div
                          className={`text-4xl font-bold text-[#495E57] transition-all duration-700 ${
                            statsAnimation
                              ? "scale-100 opacity-100"
                              : "scale-75 opacity-0"
                          }`}
                        >
                          127
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-[#F4CE14]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <div className="w-3 h-3 rounded-full bg-[#F4CE14] animate-pulse" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-[#F5F7F8] to-white p-6 rounded-2xl border-l-4 border-[#495E57] shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-[#495E57]/60 font-medium mb-1">
                          Patients Served
                        </div>
                        <div
                          className={`text-4xl font-bold text-[#495E57] transition-all duration-700 delay-100 ${
                            statsAnimation
                              ? "scale-100 opacity-100"
                              : "scale-75 opacity-0"
                          }`}
                        >
                          45,230
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-[#495E57]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Heart size={20} className="text-[#495E57]" />
                      </div>
                    </div>
                  </div>
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
