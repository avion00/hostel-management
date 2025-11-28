import CtaSection from "./components/Cta-section";
import TeamSection from "./components/Team-section";
import StatsSection from "./components/Stats-section";
import ValueSection from "./components/Value-section";
import TimelineSection from "./components/Timeline-section";
import HeroAboutSection from "./components/Hero-about-section";
import MissionVisionSection from "./components/Mission-vision-section";

function About() {
  return (
    <>
      <HeroAboutSection />
      <MissionVisionSection />
      <StatsSection />
      <ValueSection />
      <TimelineSection />
      <TeamSection />
      <CtaSection />
    </>
  );
}

export default About;
