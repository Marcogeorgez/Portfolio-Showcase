import { lazy, Suspense } from "react";
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { ProjectsSection } from "@/components/projects-section";
import { About } from "@/components/about";
import { ExperienceSection } from "@/components/experience-section";
import { SkillsSection } from "@/components/skills-section";
import { PlaySection } from "@/components/play-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { useScrollSpy } from "@/hooks/use-scroll-spy";

const AmbientScene = lazy(() => import("@/components/ambient-scene"));
const SECTIONS = ["top", "work", "about", "experience", "stack", "play", "contact"];

export default function Home() {
  const active = useScrollSpy(SECTIONS);

  return (
    <div className="relative min-h-screen text-white">
      <Suspense fallback={null}>
        <AmbientScene active={active} />
      </Suspense>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.32)_0%,rgba(0,0,0,0.1)_55%,transparent_100%)]"
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Nav />
        <main id="main" className="flex-grow">
          <Hero />
          <ProjectsSection />
          <About />
          <ExperienceSection />
          <SkillsSection />
          <PlaySection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
