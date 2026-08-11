import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  HeartHandshake,
  Quote,
  Heart,
  CheckCircle,
  Star,
} from 'lucide-react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';

const AUTO_PLAY_INTERVAL = 4000;
const RESUME_DELAY = 9000;
const MAX_DISPLAY = 6;

const SuccessStoriesCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const resumeTimerRef = useRef(null);
  const axiosSecure = useAxiosSecure();

  const {
    data: storiesData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['successStories'],
    queryFn: async () => {
      const res = await axiosSecure.get('/successStories');
      return res.data;
    },
  });

  const stories = (storiesData?.data || []).slice(0, MAX_DISPLAY);

  useEffect(() => {
    if (stories.length === 0) return;
    if (currentSlide > stories.length - 1) setCurrentSlide(0);
  }, [stories.length, currentSlide]);

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

    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => setIsAutoPlaying(true), RESUME_DELAY);
  };

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  if (isLoading) {
    return (
      <section className="bg-[#F5F7F8] dark:bg-slate-900 border-y border-slate-200/60 dark:border-slate-800/80 py-12 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded mb-8 animate-pulse" />
          <div className="h-[400px] bg-slate-200 dark:bg-slate-800/50 rounded-3xl animate-pulse" />
        </div>
      </section>
    );
  }

  if (isError || stories.length === 0) return null;

  const getSlideIndex = (offset) => {
    const total = stories.length;
    return (currentSlide + offset + total) % total;
  };

  const prevIndex = getSlideIndex(-1);
  const nextIndex = getSlideIndex(1);

  return (
    <section
      className="bg-[#F5F7F8] dark:bg-slate-900 border-y border-slate-200/60 dark:border-slate-800/80 py-12 sm:py-16 px-4 sm:px-8 relative overflow-hidden transition-colors duration-200"
      aria-label="Success Stories Carousel"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Top Minimalist Header Line with Counter */}
        <div className="flex items-end justify-between pb-3 mb-10 border-b border-slate-300/70 dark:border-slate-800">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 transition-colors">
            <HeartHandshake size={20} className="text-[#F4CE14]" aria-hidden="true" />
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#495E57] dark:text-slate-100">
              Real Impact Stories
            </span>
          </div>

          <div className="flex items-center gap-4 pb-1">
            <div className="text-sm font-mono tracking-widest text-slate-500 dark:text-slate-400">
              <span className="font-bold text-slate-800 dark:text-slate-100">
                {String(currentSlide + 1).padStart(2, '0')}
              </span>
              <span className="opacity-50">/{String(stories.length).padStart(2, '0')}</span>
            </div>

            <Link
              to="/success-stories"
              className="text-xs font-semibold text-[#495E57] dark:text-[#F4CE14] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* 3D Cover Flow Cards Stage */}
        <div className="relative h-[400px] sm:h-[440px] flex items-center justify-center">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => handleManualNavigation(prevSlide)}
            className="absolute left-1 sm:left-4 z-30 w-11 h-11 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:scale-110 hover:bg-white dark:hover:bg-slate-800 flex items-center justify-center transition-all duration-200"
            aria-label="Previous slide"
          >
            <ArrowLeft size={18} />
          </button>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={() => handleManualNavigation(nextSlide)}
            className="absolute right-1 sm:right-4 z-30 w-11 h-11 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:scale-110 hover:bg-white dark:hover:bg-slate-800 flex items-center justify-center transition-all duration-200"
            aria-label="Next slide"
          >
            <ArrowRight size={18} />
          </button>

          {/* Cards Wrapper */}
          <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
            {/* Left Card (Previous) */}
            {stories[prevIndex] && (
              <div
                onClick={() => handleManualNavigation(prevSlide)}
                className="absolute left-2 sm:left-8 w-56 sm:w-72 h-[300px] sm:h-[350px] rounded-3xl overflow-hidden shadow-xl cursor-pointer transform -translate-x-4 sm:-translate-x-12 scale-90 opacity-60 hover:opacity-80 transition-all duration-500 ease-out z-10 border border-slate-200/50 dark:border-slate-800"
              >
                <img
                  src={stories[prevIndex].image}
                  alt={stories[prevIndex].patientName || 'Previous Story'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-5">
                  <h3 className="text-xl font-bold text-white tracking-wide truncate">
                    {stories[prevIndex].patientName || stories[prevIndex].name || 'Story'}
                  </h3>
                </div>
              </div>
            )}

            {/* Center Active Card */}
            {stories[currentSlide] && (
              <div className="relative w-72 sm:w-[380px] h-[360px] sm:h-[410px] rounded-3xl overflow-hidden shadow-2xl transform scale-100 z-20 transition-all duration-500 ease-out border-2 border-slate-200/80 dark:border-slate-700 bg-slate-900">
                <img
                  src={stories[currentSlide].image}
                  alt={stories[currentSlide].patientName || 'Current Story'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent flex flex-col justify-between p-6 text-white">
                  {/* Top Quote Tag */}
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-2xl bg-[#F4CE14]/20 backdrop-blur-md flex items-center justify-center">
                      <Quote size={20} className="text-[#F4CE14]" />
                    </div>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-[#F4CE14] border border-white/20">
                      {stories[currentSlide].campName || 'CareCamp'}
                    </span>
                  </div>

                  {/* Bottom Text Overlay */}
                  <div className="space-y-3">
                    <blockquote className="text-sm sm:text-base font-medium text-slate-100 line-clamp-3 leading-relaxed drop-shadow-sm">
                      “
                      {stories[currentSlide].story ||
                        stories[currentSlide].quote ||
                        stories[currentSlide].title}
                      ”
                    </blockquote>

                    <div className="pt-2 border-t border-white/20 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                          {stories[currentSlide].patientName || stories[currentSlide].name}
                        </h3>
                        <p className="text-xs text-[#F4CE14] font-medium">
                          {stories[currentSlide].title || 'Verified Patient'}
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#F4CE14] flex items-center justify-center">
                        <Star size={16} className="text-slate-900" fill="#0f172a" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Right Card (Next) */}
            {stories[nextIndex] && (
              <div
                onClick={() => handleManualNavigation(nextSlide)}
                className="absolute right-2 sm:right-8 w-56 sm:w-72 h-[300px] sm:h-[350px] rounded-3xl overflow-hidden shadow-xl cursor-pointer transform translate-x-4 sm:translate-x-12 scale-90 opacity-60 hover:opacity-80 transition-all duration-500 ease-out z-10 border border-slate-200/50 dark:border-slate-800"
              >
                <img
                  src={stories[nextIndex].image}
                  alt={stories[nextIndex].patientName || 'Next Story'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-5">
                  <h3 className="text-xl font-bold text-white tracking-wide truncate">
                    {stories[nextIndex].patientName || stories[nextIndex].name || 'Story'}
                  </h3>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Progress Bar Indicator */}
        <div className="flex justify-center items-center mt-6 gap-2">
          {stories.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleManualNavigation(() => goToSlide(index))}
              className="group focus:outline-none py-1"
              aria-label={`Go to slide ${index + 1}`}
            >
              {currentSlide === index ? (
                <div className="w-10 h-2 rounded-full overflow-hidden bg-slate-400 dark:bg-slate-700">
                  <div
                    className="h-full bg-[#F4CE14]"
                    style={{
                      width: '100%',
                      transition: isAutoPlaying ? `width ${AUTO_PLAY_INTERVAL}ms linear` : 'none',
                    }}
                  />
                </div>
              ) : (
                <div className="w-2.5 h-2 bg-slate-300 dark:bg-slate-700 rounded-full hover:bg-slate-400 dark:hover:bg-slate-600 transition-all" />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesCarousel;
