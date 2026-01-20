import React from "react";
import HeroSection from "../../components/Home/HeroSection/HeroSection";
import SuccessStoriesCarousel from "../../components/Home/SuccessStoriesCarousel/SuccessStoriesCarousel";
import PopularCampsSection from "../../components/Home/PopularCampsSection/PopularCampsSection";
import FeaturesSection from "../../components/Home/FeaturesSection/FeaturesSection";
import HowItWorks from "../../components/Home/HowItWorks/HowItWorks";
import Testimonials from "../../components/Home/Testimonials/Testimonials";
import CallToAction from "../../components/Home/CallToAction/CallToAction";
import FeedbackRatings from "../../components/Home/FeedbackRatings/FeedbackRatings";
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
