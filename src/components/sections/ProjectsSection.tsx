"use client";

import { useState } from "react";
import { ArrowRight, Code2, Palette } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GradientText } from "@/components/ui/GradientText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ProjectCard } from "@/components/project/ProjectCard";
import { DesignCard } from "@/components/project/DesignCard";
import { softwareProjects, designProjects } from "@/content/projects";
import type { Project, DesignProject } from "@/types";
import { cn } from "@/lib/utils";

type Tab = "software" | "design";

export function ProjectsSection() {
  const [activeTab, setActiveTab] = useState<Tab>("software");
  const t = useTranslations("projects");

  const softwareItems = t.raw("items") as Record<
    string,
    { title: string; description: string; longDescription: string }
  >;
  const designItems = t.raw("designItems") as Record<
    string,
    { title: string; description: string }
  >;

  const localizedSoftware: Project[] = softwareProjects.map((p) => ({
    ...p,
    ...(softwareItems[p.slug] ?? { title: p.slug, description: "", longDescription: "" }),
  }));

  const localizedDesign: DesignProject[] = designProjects.map((p) => ({
    ...p,
    ...(designItems[p.slug] ?? { title: p.slug, description: "" }),
  }));

  return (
    <SectionWrapper id="projects">
      <AnimatedSection className="text-center mb-12">
        <SectionLabel>{t("label")}</SectionLabel>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
          {t("heading")}{" "}
          <GradientText>{t("headingHighlight")}</GradientText>
        </h2>
        <p className="mt-4 text-foreground-secondary text-lg max-w-2xl mx-auto">
          {t("desc")}
        </p>
      </AnimatedSection>

      {/* Tab switcher */}
      <AnimatedSection delay={0.1} className="flex justify-center mb-12">
        <div className="flex items-center gap-1.5 p-1.5 bg-surface border border-border rounded-2xl">
          <TabButton
            active={activeTab === "software"}
            onClick={() => setActiveTab("software")}
            icon={<Code2 size={15} />}
            count={localizedSoftware.length}
          >
            {t("tabSoftware")}
          </TabButton>
          <TabButton
            active={activeTab === "design"}
            onClick={() => setActiveTab("design")}
            icon={<Palette size={15} />}
            count={localizedDesign.length}
          >
            {t("tabDesign")}
          </TabButton>
        </div>
      </AnimatedSection>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === "software" ? (
          <motion.div
            key="software"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {localizedSoftware.filter((p) => p.featured).map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </div>

            {localizedSoftware.some((p) => !p.featured) && (
              <>
                <h3 className="text-xl font-bold text-foreground mb-6 mt-12">
                  {t("moreProjects")}
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {localizedSoftware.filter((p) => !p.featured).map((project, i) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.4 }}
                    >
                      <ProjectCard project={project} />
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            <div className="text-center mt-4">
              <a
                href="https://github.com/OmerP14"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border hover:border-accent/40 text-foreground-secondary hover:text-accent rounded-xl transition-all duration-200 text-sm font-medium"
              >
                {t("seeMore")}
                <ArrowRight size={16} />
              </a>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="design"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {localizedDesign.filter((p) => p.featured).map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <DesignCard project={project} />
                </motion.div>
              ))}
            </div>

            {localizedDesign.some((p) => !p.featured) && (
              <>
                <h3 className="text-xl font-bold text-foreground mb-6 mt-12">
                  {t("moreProjects")}
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {localizedDesign.filter((p) => !p.featured).map((project, i) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.4 }}
                    >
                      <DesignCard project={project} />
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
        active
          ? "bg-accent text-white shadow-lg shadow-accent/30"
          : "text-foreground-secondary hover:text-foreground hover:bg-surface-elevated"
      )}
    >
      {icon}
      {children}
      <span
        className={cn(
          "ml-0.5 text-xs px-1.5 py-0.5 rounded-full font-medium",
          active ? "bg-white/20 text-white" : "bg-surface-elevated text-foreground-secondary"
        )}
      >
        {count}
      </span>
    </button>
  );
}
