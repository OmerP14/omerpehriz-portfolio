"use client";

import { useState, useEffect } from "react";
import { Menu, X, Globe } from "lucide-react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useScrollProgress } from "@/hooks/useScrollProgress";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const progress = useScrollProgress();
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: t("about"), href: "#about" },
    { label: t("skills"), href: "#skills" },
    { label: t("projects"), href: "#projects" },
    { label: t("services"), href: "#services" },
    { label: t("experience"), href: "#experience" },
    { label: t("contact"), href: "#contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // html overflow: avoids body becoming a scroll container (which breaks fixed positioning)
    if (mobileOpen) document.documentElement.style.overflow = "hidden";
    else document.documentElement.style.overflow = "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [mobileOpen]);

  const toggleLocale = () => {
    router.replace(pathname, { locale: locale === "en" ? "tr" : "en" });
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-background/90 backdrop-blur-xl shadow-lg shadow-black/20"
            : "bg-background/85 backdrop-blur-lg md:bg-transparent md:backdrop-blur-none"
        )}
      >
        {/* Scroll progress bar */}
        <div
          className="absolute bottom-0 left-0 h-0.5 bg-accent transition-all duration-100 pointer-events-none"
          style={{ width: `${progress}%` }}
        />
        <nav className="layout-container flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/images/profile/logom/pngler/horizontal_white_cropped.png"
              alt="Ömer Pehriz"
              width={5131}
              height={1579}
              className="w-32 md:w-40 h-auto opacity-90 group-hover:opacity-100 transition-opacity"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm text-foreground-secondary hover:text-foreground rounded-lg hover:bg-surface-elevated transition-all duration-200"
              >
                {item.label}
              </a>
            ))}

            {/* Language toggle */}
            <button
              onClick={toggleLocale}
              className="ml-2 flex items-center gap-1.5 px-3 py-2 text-sm text-foreground-secondary hover:text-foreground rounded-lg hover:bg-surface-elevated transition-all duration-200 border border-transparent hover:border-border"
              aria-label="Switch language"
            >
              <Globe size={14} />
              <span className="font-medium">{locale === "en" ? "TR" : "EN"}</span>
            </button>

            <a
              href="#contact"
              className="ml-2 px-5 py-2 bg-accent hover:bg-accent-light text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/30"
            >
              {t("hireMe")}
            </a>
          </div>

          {/* Mobile: lang toggle + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleLocale}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-foreground-secondary hover:text-foreground rounded-lg border border-border hover:border-accent/40 transition-all"
              aria-label="Switch language"
            >
              <Globe size={12} />
              <span className="font-medium">{locale === "en" ? "TR" : "EN"}</span>
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-foreground-secondary hover:text-foreground hover:bg-surface-elevated rounded-lg transition-all"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl md:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="flex flex-col items-center justify-center h-full gap-6 px-8"
            onClick={(e) => e.stopPropagation()}
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-2xl font-medium text-foreground-secondary hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="mt-4 px-8 py-3 bg-accent text-white font-semibold rounded-xl text-lg"
            >
              {t("hireMe")}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
