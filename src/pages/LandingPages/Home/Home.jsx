import React from "react";
import HeroSection from "../../../components/HomeComs/HeroSection/HeroSection";
import SuccessStoriesCarousel from "../../../components/HomeComs/SuccessStoriesCarousel/SuccessStoriesCarousel";
import PopularCampsSection from "../../../components/HomeComs/PopularCampsSection/PopularCampsSection";
import FeaturesSection from "../../../components/HomeComs/FeaturesSection/FeaturesSection";
import HowItWorks from "../../../components/HomeComs/HowItWorks/HowItWorks";
import Testimonials from "../../../components/HomeComs/Testimonials/Testimonials";
import FeedbackRatings from "../../../components/HomeComs/FeedbackRatings/FeedbackRatings";
const Home = () => {
  return (
    <div>
      <HeroSection />
      <SuccessStoriesCarousel />
      <PopularCampsSection />
      <FeaturesSection />
      <HowItWorks />
      <Testimonials />
      <FeedbackRatings />
    </div>
  );
};

export default Home;
