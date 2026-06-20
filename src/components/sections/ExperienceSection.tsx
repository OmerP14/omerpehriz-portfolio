import { getTranslations } from "next-intl/server";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GradientText } from "@/components/ui/GradientText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Badge } from "@/components/ui/Badge";
import { TiltCard } from "@/components/ui/TiltCard";
import { workExperienceConfig, educationConfig } from "@/content/experience";
import type { ExperienceItem } from "@/types";
import { Briefcase, GraduationCap, Download } from "lucide-react";

function TimelineItem({
  item,
  index,
  currentLabel,
}: {
  item: ExperienceItem;
  index: number;
  currentLabel: string;
}) {
  const isWork = item.type === "work";

  return (
    <AnimatedSection delay={index * 0.1} className="relative pl-10 pb-2">
      {/* Glowing vertical line */}
      <div
        className="absolute left-0 top-6 bottom-0 w-px"
        style={{
          background: item.current
            ? "linear-gradient(180deg, #6366f1 0%, #6366f140 60%, transparent 100%)"
            : "linear-gradient(180deg, #6366f130 0%, transparent 100%)",
        }}
      />

      {/* Timeline dot */}
      <div className="absolute left-[-5px] top-5">
        {item.current ? (
          <>
            {/* Outer pulse ring */}
            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-accent/30 animate-ping" />
            {/* Inner solid dot */}
            <div
              className="relative w-2.5 h-2.5 rounded-full bg-accent border-2 border-accent"
              style={{ boxShadow: "0 0 12px #6366f1, 0 0 24px #6366f140" }}
            />
          </>
        ) : (
          <div className="w-2.5 h-2.5 rounded-full bg-background border-2 border-border" />
        )}
      </div>

      <div className="mb-6">
        <TiltCard maxTilt={6} glowColor={item.current ? "#6366f1" : "#6366f140"}>
          <div
            className={`bg-surface border rounded-2xl p-6 transition-colors duration-300 ${
              item.current ? "border-accent/30" : "border-border hover:border-accent/20"
            }`}
          >
            {item.current && (
              <div
                className="absolute inset-x-0 top-0 h-px rounded-t-2xl pointer-events-none"
                style={{ background: "linear-gradient(90deg, transparent, #6366f1, transparent)" }}
              />
            )}

            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="font-bold text-foreground text-lg">
                  {isWork ? item.role : item.degree}
                </h3>
                <p className="text-accent text-sm font-medium">
                  {isWork ? item.company : item.institution}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className="text-xs text-foreground-secondary bg-surface-elevated border border-border px-3 py-1 rounded-full">
                  {item.period}
                </span>
                {item.current && (
                  <span className="flex items-center gap-1.5 text-xs text-green-400 font-medium">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    {currentLabel}
                  </span>
                )}
              </div>
            </div>

            <p className="text-foreground-secondary text-sm leading-relaxed mb-4">
              {item.description}
            </p>

            {item.technologies && item.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.technologies.map((tech) => (
                  <Badge key={tech} variant="accent">
                    {tech}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </TiltCard>
      </div>
    </AnimatedSection>
  );
}

export async function ExperienceSection() {
  const t = await getTranslations("experience");

  const workTexts = t.raw("work") as Array<{
    role: string;
    company: string;
    period: string;
    description: string;
  }>;
  const educationTexts = t.raw("education") as Array<{
    degree: string;
    institution: string;
    period: string;
    description: string;
  }>;

  const workItems: ExperienceItem[] = workExperienceConfig.map((config, i) => ({
    ...config,
    ...(workTexts[i] ?? { role: "", company: "", period: "", description: "" }),
  }));

  const educationItems: ExperienceItem[] = educationConfig.map((config, i) => ({
    ...config,
    ...(educationTexts[i] ?? { degree: "", institution: "", period: "", description: "" }),
  }));

  return (
    <SectionWrapper id="experience">
      <AnimatedSection className="text-center mb-16">
        <SectionLabel>{t("label")}</SectionLabel>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
          {t("heading")} <GradientText>{t("headingHighlight")}</GradientText>
        </h2>
        <p className="mt-4 text-foreground-secondary text-lg max-w-xl mx-auto">
          {t("desc")}
        </p>
      </AnimatedSection>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Work */}
        <div>
          <AnimatedSection className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-accent/10 border border-accent/20">
              <Briefcase size={18} className="text-accent" />
            </div>
            <h3 className="text-xl font-bold text-foreground">{t("workTitle")}</h3>
          </AnimatedSection>
          <div>
            {workItems.map((item, i) => (
              <TimelineItem key={i} item={item} index={i} currentLabel={t("current")} />
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <AnimatedSection className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-accent/10 border border-accent/20">
              <GraduationCap size={18} className="text-accent" />
            </div>
            <h3 className="text-xl font-bold text-foreground">{t("educationTitle")}</h3>
          </AnimatedSection>
          <div>
            {educationItems.map((item, i) => (
              <TimelineItem key={i} item={item} index={i} currentLabel={t("current")} />
            ))}
          </div>

          <AnimatedSection delay={0.2} className="mt-8 pl-10">
            <a
              href="/cv.pdf"
              download
              className="inline-flex items-center gap-2 px-6 py-3 border border-accent/30 hover:border-accent text-accent hover:bg-accent/10 font-medium rounded-xl transition-all duration-200 text-sm"
            >
              <Download size={16} />
              {t("downloadCV")}
            </a>
          </AnimatedSection>
        </div>
      </div>
    </SectionWrapper>
  );
}
