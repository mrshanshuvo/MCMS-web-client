import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Star,
  CheckCircle,
  Heart,
  Users,
  Activity,
} from "lucide-react";

const SuccessStoriesCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const stories = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      role: "Pediatrician, Boston",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      quote:
        "MCMS transformed how we organize our annual children's health camps.",
      achievement: "Served 1,200+ children in underserved communities",
      stats: [
        {
          icon: <Users size={18} />,
          value: "1,200+",
          label: "Children served",
        },
        {
          icon: <CheckCircle size={18} />,
          value: "98%",
          label: "Satisfaction rate",
        },
        { icon: <Activity size={18} />, value: "3x", label: "More efficient" },
      ],
    },
    {
      id: 2,
      name: "Rural Health Initiative",
      role: "Non-profit Organization",
      image:
        "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      quote: "With MCMS, we've expanded our reach to 5 new counties this year.",
      achievement: "Established 12 new rural health camps in 2023",
      stats: [
        {
          icon: <Heart size={18} />,
          value: "5,000+",
          label: "Patients reached",
        },
        { icon: <Star size={18} />, value: "24", label: "New volunteers" },
        {
          icon: <CheckCircle size={18} />,
          value: "85%",
          label: "Follow-up rate",
        },
      ],
    },
    {
      id: 3,
      name: "Dr. Michael Chen",
      role: "Cardiologist, San Francisco",
      image:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      quote:
        "The patient management tools saved us hundreds of hours last quarter.",
      achievement: "Reduced administrative time by 65%",
      stats: [
        {
          icon: <Users size={18} />,
          value: "750+",
          label: "Cardiac screenings",
        },
        { icon: <Activity size={18} />, value: "65%", label: "Time saved" },
        { icon: <Star size={18} />, value: "4.9/5", label: "Staff rating" },
      ],
    },
  ];

  // Auto-advance slides
  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev === stories.length - 1 ? 0 : prev + 1));
      }, 7000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, stories.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === stories.length - 1 ? 0 : prev + 1));
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? stories.length - 1 : prev - 1));
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="bg-gray-50 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Success Stories
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-gray-600">
            How MCMS is making a difference in healthcare communities
          </p>
        </div>

        <div className="relative">
          {/* Carousel container */}
          <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white">
            {/* Slides */}
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {stories.map((story) => (
                <div key={story.id} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-6 sm:p-8">
                    {/* Left column - Image */}
                    <div className="relative h-48 sm:h-64 md:h-80 rounded-xl overflow-hidden">
                      <img
                        src={story.image}
                        alt={`${story.name} portrait`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-lg sm:text-xl font-bold">
                          {story.name}
                        </h3>
                        <p className="text-sm sm:text-base text-blue-200">
                          {story.role}
                        </p>
                      </div>
                    </div>

                    {/* Right column - Content */}
                    <div className="flex flex-col justify-center px-2 sm:px-4">
                      <blockquote className="text-base sm:text-xl font-medium text-gray-700 mb-4 sm:mb-6">
                        "{story.quote}"
                      </blockquote>

                      <div className="mb-4 sm:mb-6">
                        <div className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium mb-2">
                          <Star className="mr-1" size={12} />
                          Key Achievement
                        </div>
                        <p className="text-base sm:text-lg font-semibold text-gray-900">
                          {story.achievement}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 sm:gap-4">
                        {story.stats.map((stat, index) => (
                          <div
                            key={index}
                            className="bg-blue-50 rounded-lg p-2 sm:p-3 text-center"
                          >
                            <div className="text-blue-600 flex justify-center mb-1">
                              {stat.icon}
                            </div>
                            <p className="font-bold text-gray-900 text-sm sm:text-base">
                              {stat.value}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500">
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

            {/* Navigation arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 sm:p-3 rounded-full shadow-md transition-all hover:scale-110"
              aria-label="Previous slide"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 sm:p-3 rounded-full shadow-md transition-all hover:scale-110"
              aria-label="Next slide"
            >
              <ArrowRight size={20} />
            </button>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center mt-4 sm:mt-6 space-x-2">
            {stories.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`rounded-full transition-all
                  ${
                    currentSlide === index
                      ? "bg-blue-600 w-6 h-6 sm:w-8 sm:h-8"
                      : "bg-gray-300 w-4 h-4 sm:w-6 sm:h-6"
                  }
                `}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesCarousel;
