import { getTranslations } from "next-intl/server";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GradientText } from "@/components/ui/GradientText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ContactForm } from "@/components/ui/ContactForm";
import { personalInfo } from "@/content/personal";
import { Mail, MapPin, Github, Linkedin, Instagram, Clock } from "lucide-react";

export async function ContactSection() {
  const t = await getTranslations("contact");

  const contactInfo = [
    {
      icon: Mail,
      label: t("emailLabel"),
      value: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
    },
    {
      icon: MapPin,
      label: t("locationLabel"),
      value: personalInfo.location,
      href: null,
    },
    {
      icon: Clock,
      label: t("responseTimeLabel"),
      value: t("responseTimeValue"),
      href: null,
    },
  ];

  const socialLinks = [
    { icon: Github, label: "GitHub", href: personalInfo.social.github },
    { icon: Linkedin, label: "LinkedIn", href: personalInfo.social.linkedin },
    { icon: Instagram, label: "Instagram", href: personalInfo.social.instagram ?? "#" },
  ];

  return (
    <SectionWrapper id="contact">
      <AnimatedSection className="text-center mb-16">
        <SectionLabel>{t("label")}</SectionLabel>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
          {t("heading")} <GradientText>{t("headingHighlight")}</GradientText>
        </h2>
        <p className="mt-4 text-foreground-secondary text-lg max-w-2xl mx-auto">
          {t("desc")}
        </p>
      </AnimatedSection>

      <div className="grid lg:grid-cols-5 gap-12 items-start">
        <AnimatedSection direction="left" className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            {contactInfo.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 shrink-0">
                  <Icon size={18} className="text-accent" />
                </div>
                <div>
                  <p className="text-foreground-secondary text-xs font-medium uppercase tracking-wider mb-1">
                    {label}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      className="text-foreground hover:text-accent transition-colors text-sm"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="text-foreground text-sm">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="h-px bg-border" />

          <div>
            <p className="text-foreground-secondary text-sm mb-4 font-medium">{t("findMeOn")}</p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-3 border border-border hover:border-accent/40 rounded-xl text-foreground-secondary hover:text-accent transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div className="p-5 bg-surface-elevated border border-border rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-sm font-medium">{t("availableTitle")}</span>
            </div>
            <p className="text-foreground-secondary text-sm">{t("availableDesc")}</p>
          </div>
        </AnimatedSection>

        <AnimatedSection direction="right" delay={0.1} className="lg:col-span-3">
          <div className="bg-surface border border-border rounded-2xl p-8">
            <ContactForm />
          </div>
        </AnimatedSection>
      </div>
    </SectionWrapper>
  );
}
