import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GradientText } from "@/components/ui/GradientText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TiltCard } from "@/components/ui/TiltCard";
import { personalInfo } from "@/content/personal";
import { MapPin, Coffee, Rocket, Heart, Code2, Smartphone, Database, Zap } from "lucide-react";

export async function AboutSection() {
  const t = await getTranslations("about");
  const tp = await getTranslations("personal");

  const capabilities = [
    { icon: Code2,       title: t("cap1Title"), desc: t("cap1Desc") },
    { icon: Smartphone,  title: t("cap2Title"), desc: t("cap2Desc") },
    { icon: Database,    title: t("cap3Title"), desc: t("cap3Desc") },
    { icon: Zap,         title: t("cap4Title"), desc: t("cap4Desc") },
  ];

  const values = [
    { icon: Rocket,  text: t("valueShip") },
    { icon: Coffee,  text: t("valueCode") },
    { icon: Heart,   text: t("valueDesign") },
    { icon: MapPin,  text: personalInfo.location },
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

            {/* Capability cards */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              {capabilities.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="relative bg-surface-elevated border border-border hover:border-accent/40 rounded-2xl p-4 transition-all duration-200 group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                    <Icon size={16} className="text-accent" />
                  </div>
                  <div className="text-foreground font-semibold text-sm leading-snug">{title}</div>
                  <div className="text-foreground-secondary text-xs mt-1 leading-relaxed">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </SectionWrapper>
  );
}
