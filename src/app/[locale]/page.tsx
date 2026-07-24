import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { getSoftwareProjects, getDesignProjects } from "@/content/projects";
import { getTestimonials } from "@/content/testimonials";

export default async function Home() {
  const [softwareProjects, designProjects, testimonials] = await Promise.all([
    getSoftwareProjects(),
    getDesignProjects(),
    getTestimonials(),
  ]);

  return (
    <>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection softwareProjects={softwareProjects} designProjects={designProjects} />
      <ServicesSection />
      <ExperienceSection />
      <TestimonialsSection testimonials={testimonials} />
      <ContactSection />
    </>
  );
}
