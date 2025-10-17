"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Star,
  CheckCircle,
  Heart,
  Users,
  Activity,
  Quote,
} from "lucide-react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const iconMap = {
  Users: (props) => <Users {...props} />,
  CheckCircle: (props) => <CheckCircle {...props} />,
  Activity: (props) => <Activity {...props} />,
  Star: (props) => <Star {...props} />,
  Heart: (props) => <Heart {...props} />,
};

const AUTO_PLAY_INTERVAL = 7000;
const RESUME_DELAY = 9000;
const MAX_DISPLAY = 4;

const SuccessStoriesCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const axiosSecure = useAxiosSecure();

  // Fetch stories from API
  const { data: storiesData = { data: [] } } = useQuery({
    queryKey: ["successStories"],
    queryFn: async () => {
      const res = await axiosSecure.get("/successStories");
      return res.data;
    },
  });

  const stories = (storiesData.data || []).slice(0, MAX_DISPLAY);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === stories.length - 1 ? 0 : prev + 1));
  }, [stories.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? stories.length - 1 : prev - 1));
  }, [stories.length]);

  const goToSlide = useCallback((index) => setCurrentSlide(index), []);

  useEffect(() => {
    if (!isAutoPlaying || stories.length === 0) return;

    const interval = setInterval(nextSlide, AUTO_PLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, stories.length]);

  const handleManualNavigation = (navigationFn) => {
    navigationFn();
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), RESUME_DELAY);
  };

  if (!stories.length) return null; // or loading skeleton

  return (
    <section
      className="bg-[#F5F7F8] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      aria-label="Success Stories Carousel"
    >
      <div className="absolute top-24 right-0 w-80 h-80 bg-[#F4CE14]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-24 left-0 w-72 h-72 bg-[#495E57]/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-[#495E57]/10 mb-6">
            <Star size={16} className="text-[#F4CE14]" fill="#F4CE14" />
            <span className="text-sm font-medium text-[#495E57]">
              Real Impact Stories
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#45474B]">
            Success Stories
          </h2>
          <p className="mt-4 text-lg text-[#495E57]/70 max-w-2xl mx-auto">
            Discover how healthcare professionals are transforming communities
            with MCMS
          </p>
        </div>

        <div className="relative">
          <div
            className="relative overflow-hidden rounded-3xl bg-white shadow-xl border border-[#495E57]/10"
            role="region"
            aria-roledescription="carousel"
            aria-label="Success stories"
          >
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              role="list"
            >
              {stories.map((story, index) => (
                <div
                  key={story.id}
                  className="w-full flex-shrink-0"
                  role="listitem"
                  aria-label={`Slide ${index + 1} of ${stories.length}`}
                  aria-hidden={currentSlide !== index}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch h-[500px] sm:h-[600px] lg:h-[550px]">
                    <div className="relative w-full h-full min-h-0 overflow-hidden group">
                      <img
                        src={story.image}
                        alt={`${story.name}, ${story.role}`}
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-[#495E57]/80 via-[#45474B]/60 to-transparent" />
                      <div className="absolute top-8 left-8 w-14 h-14 bg-[#F4CE14]/20 rounded-xl flex items-center justify-center">
                        <Quote size={28} className="text-[#F4CE14]" />
                      </div>
                      <div className="absolute bottom-16 left-8 right-8">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                          <h3 className="text-2xl font-bold text-white">
                            {story.name}
                          </h3>
                          <p className="text-sm text-[#F4CE14]">{story.role}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
                      <blockquote className="text-lg sm:text-xl md:text-2xl font-medium text-[#45474B] mb-8 leading-relaxed relative">
                        <span className="absolute text-[#F4CE14] text-6xl -top-6 -left-2 opacity-20 select-none">
                          “
                        </span>
                        <span className="relative z-10">{story.quote}</span>
                      </blockquote>
                      <div className="mb-8 p-5 bg-gradient-to-br from-[#F4CE14]/10 to-transparent rounded-2xl border-l-4 border-[#F4CE14]">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-[#F4CE14] rounded-lg flex items-center justify-center">
                            <Star size={16} className="text-[#495E57]" />
                          </div>
                          <span className="text-sm font-semibold text-[#495E57] uppercase tracking-wide">
                            Key Achievement
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-[#45474B]">
                          {story.achievement}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {story.stats.map((stat, i) => (
                          <div
                            key={i}
                            className="bg-gradient-to-br from-[#F5F7F8] to-white rounded-2xl p-4 text-center border border-[#495E57]/10 hover:border-[#F4CE14]/30 hover:shadow-md transition-all duration-300 group"
                          >
                            <div className="w-10 h-10 bg-[#495E57]/10 rounded-xl flex items-center justify-center mx-auto mb-3 text-[#495E57] group-hover:bg-[#495E57] group-hover:text-[#F4CE14] transition-all duration-300">
                              {iconMap[stat.icon]?.({ size: 18 })}
                            </div>
                            <p className="font-bold text-[#45474B] text-lg mb-1">
                              {stat.value}
                            </p>
                            <p className="text-xs text-[#495E57]/60 font-medium">
                              {stat.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* nav arrows */}
            <button
              onClick={() => handleManualNavigation(prevSlide)}
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 bg-white hover:bg-[#495E57] text-[#495E57] hover:text-white p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10 border border-[#495E57]/10"
              aria-label="Previous slide"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={() => handleManualNavigation(nextSlide)}
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 bg-white hover:bg-[#495E57] text-[#495E57] hover:text-white p-3 sm:p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10 border border-[#495E57]/10"
              aria-label="Next slide"
            >
              <ArrowRight size={20} />
            </button>
          </div>

          {/* progress dots */}
          <div
            className="flex justify-center items-center mt-8 gap-3"
            role="tablist"
            aria-label="Slide navigation"
          >
            {stories.map((_, index) => (
              <button
                key={index}
                onClick={() => handleManualNavigation(() => goToSlide(index))}
                className="group relative"
                role="tab"
                aria-selected={currentSlide === index}
                aria-label={`Go to slide ${index + 1}`}
                aria-controls={`slide-${index}`}
              >
                {currentSlide === index ? (
                  <div className="relative w-12 h-3 rounded-full overflow-hidden bg-[#495E57]/30">
                    <div
                      className="absolute inset-0 bg-[#F4CE14] animate-[progress_7s_linear]"
                      style={{
                        animationPlayState: isAutoPlaying
                          ? "running"
                          : "paused",
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-3 h-3 bg-[#495E57]/30 rounded-full hover:bg-[#495E57]/50 transition-all duration-300" />
                )}
              </button>
            ))}
          </div>

          {/* view more button */}
          <div className="flex justify-center mt-12">
            <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 flex items-center justify-center shadow-lg border border-white/30 transition-transform duration-300 hover:scale-105">
              <button
                onClick={() => (window.location.href = "/success-stories")}
                className="px-8 py-3 bg-gradient-to-r from-[#F4CE14]/90 to-[#F4CE14] text-[#45474B] font-semibold rounded-full shadow-md hover:shadow-xl hover:from-[#F4CE14] hover:to-[#F4CE14]/90 transition-all duration-300"
              >
                View More Success Stories
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesCarousel;
