import { getTranslations } from "next-intl/server";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GradientText } from "@/components/ui/GradientText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TiltCard } from "@/components/ui/TiltCard";
import { servicesConfig } from "@/content/services";
import type { Service } from "@/types";
import {
  Globe,
  Smartphone,
  LayoutDashboard,
  Server,
  Database,
  Palette,
  MessageSquare,
  Check,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Globe,
  Smartphone,
  LayoutDashboard,
  Server,
  Database,
  Palette,
  MessageSquare,
};

export async function ServicesSection() {
  const t = await getTranslations("services");
  const serviceTexts = t.raw("items") as Array<{
    title: string;
    description: string;
    features: string[];
  }>;

  const services: Service[] = servicesConfig.map((config, i) => ({
    ...config,
    ...(serviceTexts[i] ?? { title: "", description: "", features: [] }),
  }));

  return (
    <SectionWrapper id="services" alt>
      <AnimatedSection className="text-center mb-16">
        <SectionLabel>{t("label")}</SectionLabel>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
          {t("heading")} <GradientText>{t("headingHighlight")}</GradientText>
        </h2>
        <p className="mt-4 text-foreground-secondary text-lg max-w-2xl mx-auto">
          {t("desc")}
        </p>
      </AnimatedSection>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {services.map((service, i) => {
          const Icon = iconMap[service.icon] ?? Globe;
          return (
            <AnimatedSection key={i} delay={i * 0.06} className="h-full">
              <TiltCard glowColor={service.highlight ? "#6366f1" : "#6366f150"} maxTilt={12}>
                <div
                  className={`relative h-full bg-background border rounded-2xl p-6 flex flex-col transition-colors duration-300 overflow-hidden ${
                    service.highlight
                      ? "border-accent/50 bg-accent/5 shadow-lg shadow-accent/10"
                      : "border-border hover:border-accent/30"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`inline-flex p-3 rounded-xl mb-5 w-fit ${
                      service.highlight
                        ? "bg-accent text-white shadow-lg shadow-accent/30"
                        : "bg-accent/10 border border-accent/20 text-accent"
                    }`}
                  >
                    <Icon size={22} />
                  </div>

                  {service.highlight && (
                    <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl"
                      style={{ background: "linear-gradient(90deg, transparent, #6366f1, transparent)" }}
                    />
                  )}

                  <h3 className="font-bold text-foreground mb-2">{service.title}</h3>
                  <p className="text-foreground-secondary text-sm leading-relaxed mb-5 flex-1">
                    {service.description}
                  </p>

                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-xs text-foreground-secondary"
                      >
                        <Check size={13} className="text-accent shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
            </AnimatedSection>
          );
        })}
      </div>

      <AnimatedSection delay={0.2} className="mt-16">
        <div className="relative overflow-hidden border border-accent/20 rounded-2xl p-8 sm:p-12 text-center">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-purple-500/5 pointer-events-none" />
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          {/* Glowing orbs */}
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <h3 className="relative text-2xl font-bold text-foreground mb-3">
            {t("ctaHeading")}
          </h3>
          <p className="relative text-foreground-secondary mb-6 max-w-md mx-auto">
            {t("ctaDesc")}
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-light text-white font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/30 relative"
          >
            {t("ctaButton")}
          </a>
        </div>
      </AnimatedSection>
    </SectionWrapper>
  );
}
