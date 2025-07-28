import React from 'react';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import HowItWorks from './HowItWorks';
import Testimonials from './Testimonials';
import CallToAction from './CallToAction';

const Home = () => {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
    </div>
  );
};

export default Home;
