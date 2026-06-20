import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GradientText } from "@/components/ui/GradientText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StatCounter } from "@/components/ui/StatCounter";
import { TiltCard } from "@/components/ui/TiltCard";
import { personalInfo } from "@/content/personal";
import { MapPin, Coffee, Rocket, Heart } from "lucide-react";

export async function AboutSection() {
  const t = await getTranslations("about");
  const tp = await getTranslations("personal");

  const stats = [
    { value: "3+", label: t("statsYearsLabel") },
    { value: "20+", label: t("statsProjectsLabel") },
    { value: "15+", label: t("statsClientsLabel") },
    { value: "100%", label: t("statsSatisfactionLabel") },
  ];

  const values = [
    { icon: Rocket, text: t("valueShip") },
    { icon: Coffee, text: t("valueCode") },
    { icon: Heart, text: t("valueDesign") },
    { icon: MapPin, text: personalInfo.location },
  ];

  const bio = [tp("bio1"), tp("bio2"), tp("bio3")];

  return (
    <SectionWrapper id="about">
      <AnimatedSection className="text-center mb-16">
        <SectionLabel>{t("label")}</SectionLabel>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
          {t("heading")}{" "}
          <GradientText>{t("headingHighlight")}</GradientText>
        </h2>
      </AnimatedSection>

      <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
        {/* Photo column */}
        <AnimatedSection delay={0.15} direction="left" className="w-full">
          <div className="relative w-full">
            {/* Avatar with 3D tilt */}
            <TiltCard maxTilt={8} glowColor="#6366f1">
              <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-surface-elevated border border-border">
                <Image
                  src={personalInfo.avatarPath}
                  alt={personalInfo.name}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-purple-500/5 pointer-events-none" />
              </div>
            </TiltCard>

            <div className="mt-4 grid grid-cols-2 gap-3 bg-surface border border-border rounded-2xl p-4">
              {values.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-foreground-secondary text-sm">
                  <Icon size={14} className="text-accent shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Decorative outer ring */}
            <div className="absolute -inset-3 border border-accent/10 rounded-[2rem] -z-10 pointer-events-none" />
          </div>
        </AnimatedSection>

        {/* Text column */}
        <AnimatedSection delay={0.25} direction="right" className="w-full">
          <div className="space-y-5">
            {bio.map((para, i) => (
              <p key={i} className="text-foreground-secondary text-lg leading-relaxed">
                {para}
              </p>
            ))}

            {/* Animated stat counters */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {stats.map((stat) => (
                <StatCounter key={stat.label} value={stat.value} label={stat.label} />
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </SectionWrapper>
  );
}
