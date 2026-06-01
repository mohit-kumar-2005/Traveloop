import MeshBackground from '../components/landing/MeshBackground.jsx';
import LandingNav from '../components/landing/LandingNav.jsx';
import HeroSection from '../components/landing/HeroSection.jsx';
import DestinationsSection from '../components/landing/DestinationsSection.jsx';
import AIPlannerSection from '../components/landing/AIPlannerSection.jsx';
import FeaturesSection from '../components/landing/FeaturesSection.jsx';
import PricingSection from '../components/landing/PricingSection.jsx';
import StatsSection from '../components/landing/StatsSection.jsx';
import TestimonialsSection from '../components/landing/TestimonialsSection.jsx';
import GallerySection from '../components/landing/GallerySection.jsx';
import AboutSection from '../components/landing/AboutSection.jsx';
import CTASection from '../components/landing/CTASection.jsx';
import LandingFooter from '../components/landing/LandingFooter.jsx';

export default function LandingPage() {
  return (
    <MeshBackground>
      <LandingNav />
      <main>
        <HeroSection />
        <DestinationsSection />
        <AIPlannerSection />
        <FeaturesSection />
        <PricingSection />
        <StatsSection />
        <TestimonialsSection />
        <GallerySection />
        <AboutSection />
        <CTASection />
      </main>
      <LandingFooter />
    </MeshBackground>
  );
}
