"use client";

import { motion } from "framer-motion";
import { ArrowDown, Download, Mail, Github, Linkedin } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { personalInfo } from "@/content/personal";
import { HeroBackground } from "@/components/ui/HeroBackground";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

export function HeroSection() {
  const t = useTranslations("personal");
  const th = useTranslations("hero");

  return (
    <section
      id="home"
      className="relative w-full min-h-screen pt-16 flex items-center justify-center overflow-hidden"
    >
      {/* 3D animated background */}
      <HeroBackground />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.018] pointer-events-none"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 layout-container">
        <div className="w-full max-w-[48rem] mx-auto text-center flex flex-col items-center">
          <motion.div {...fadeUp(0)} className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-accent text-sm font-medium">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              {t("availability")}
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.08)}
            className="text-5xl sm:text-7xl lg:text-[88px] font-extrabold text-foreground leading-[1.05] tracking-tight mb-5"
          >
            {personalInfo.name}
          </motion.h1>

          <motion.p
            {...fadeUp(0.16)}
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold bg-gradient-to-r from-accent via-violet-400 to-purple-400 bg-clip-text text-transparent mb-7"
          >
            {t("title")}
          </motion.p>

          <motion.p
            {...fadeUp(0.24)}
            className="text-foreground-secondary text-lg sm:text-xl mb-12 leading-relaxed"
          >
            {t("tagline")}
          </motion.p>

          <motion.div
            {...fadeUp(0.32)}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 w-full"
          >
            <Link
              href="#projects"
              className="w-full sm:w-auto px-8 py-4 bg-accent hover:bg-accent-light text-white font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/30 text-center"
            >
              {th("viewProjects")}
            </Link>
            <a
              href={personalInfo.cvPath}
              download
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 border border-border hover:border-accent/50 text-foreground hover:text-accent font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5"
            >
              <Download size={18} />
              {th("downloadCV")}
            </a>
            <Link
              href="#contact"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-foreground-secondary hover:text-foreground font-semibold rounded-xl hover:bg-surface-elevated transition-all duration-200"
            >
              <Mail size={18} />
              {th("contactMe")}
            </Link>
          </motion.div>

          <motion.div
            {...fadeUp(0.4)}
            className="flex items-center justify-center gap-4"
          >
            <a
              href={personalInfo.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 border border-border hover:border-accent/40 rounded-xl text-foreground-secondary hover:text-accent transition-all duration-200 hover:-translate-y-0.5"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href={personalInfo.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 border border-border hover:border-accent/40 rounded-xl text-foreground-secondary hover:text-accent transition-all duration-200 hover:-translate-y-0.5"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <div className="w-px h-5 bg-border" />
            <a
              href={`mailto:${personalInfo.email}`}
              className="text-foreground-secondary hover:text-accent text-sm transition-colors"
            >
              {personalInfo.email}
            </a>
          </motion.div>
        </div>
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-foreground-secondary hover:text-accent transition-colors"
        aria-label="Scroll down"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={22} />
        </motion.div>
      </motion.a>
    </section>
  );
}
