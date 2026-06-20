import { getTranslations } from "next-intl/server";
import { Github, Linkedin, Instagram, Mail, Code2, ArrowUp } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { personalInfo } from "@/content/personal";

export async function Footer() {
  const t = await getTranslations("footer");
  const tn = await getTranslations("nav");

  const socials = [
    { icon: Github, href: personalInfo.social.github, label: "GitHub" },
    { icon: Linkedin, href: personalInfo.social.linkedin, label: "LinkedIn" },
    { icon: Instagram, href: personalInfo.social.instagram ?? "#", label: "Instagram" },
    { icon: Mail, href: `mailto:${personalInfo.email}`, label: "Email" },
  ];

  const footerLinks = [
    { label: tn("about"), href: "#about" },
    { label: tn("projects"), href: "#projects" },
    { label: tn("services"), href: "#services" },
    { label: tn("experience"), href: "#experience" },
    { label: tn("contact"), href: "#contact" },
  ];

  return (
    <footer className="border-t border-border bg-surface mt-24">
      <div className="layout-container py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-foreground font-bold text-lg">
              <div className="p-1.5 rounded-lg bg-accent/10 border border-accent/20">
                <Code2 size={16} className="text-accent" />
              </div>
              <span>
                <span className="text-accent">Ö</span>mer Pehriz
              </span>
            </Link>
            <p className="text-foreground-secondary text-sm leading-relaxed max-w-xs">
              {t("tagline")}
            </p>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-xs font-medium">{t("available")}</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-foreground font-semibold text-sm mb-4">{t("navigation")}</h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-foreground-secondary hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-foreground font-semibold text-sm mb-4">{t("getInTouch")}</h3>
            <div className="flex gap-3 mb-6">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2.5 border border-border hover:border-accent/40 rounded-xl text-foreground-secondary hover:text-accent transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
            <a
              href={`mailto:${personalInfo.email}`}
              className="text-sm text-foreground-secondary hover:text-accent transition-colors break-all"
            >
              {personalInfo.email}
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-foreground-secondary text-sm">
            © {new Date().getFullYear()} Ömer Pehriz. {t("rights")}
          </p>
          <a
            href="#home"
            className="flex items-center gap-2 px-4 py-2 border border-border hover:border-accent/40 rounded-xl text-foreground-secondary hover:text-accent text-sm transition-all duration-200"
          >
            {t("backToTop")}
            <ArrowUp size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
