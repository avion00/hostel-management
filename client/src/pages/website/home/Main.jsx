import CtaSection from "./components/Cta-section";
import FeatureSection from "./components/Feature-section";
import HomeMapSection from "./components/Home-map-section";
import RoomTypeSection from "./components/Room-type-section";
import AmenitiesSection from "./components/Amenities-section";
import TestimonialsSection from "./components/Testimonials-section";
import SearchHostelSection from "./components/Search-hostel-section";

function Home() {
  return (
    <>
      <SearchHostelSection />
      <HomeMapSection />
      <RoomTypeSection />
      <FeatureSection />
      <AmenitiesSection />
      <TestimonialsSection />
      <CtaSection />
    </>
  );
}

export default Home;
