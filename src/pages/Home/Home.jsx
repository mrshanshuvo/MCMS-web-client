import React from "react";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import HowItWorks from "./HowItWorks";
import Testimonials from "./Testimonials";
import CallToAction from "./CallToAction";
import SuccessStoriesCarousel from "./SuccessStoriesCarousel";
import PopularCampsSection from "./PopularCampsSection";
import FeedbackRatings from "./FeedbackRatings";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <SuccessStoriesCarousel />
      <PopularCampsSection />
      <FeaturesSection />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
      <FeedbackRatings />
    </div>
  );
};

export default Home;
