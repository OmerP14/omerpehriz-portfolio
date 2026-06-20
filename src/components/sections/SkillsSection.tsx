"use client";

import { useRef, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Monitor, Server, Wrench } from "lucide-react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiFramer,
  SiNodedotjs,
  SiExpress,
  SiSupabase,
  SiPostgresql,
  SiGit,
  SiDocker,
  SiVercel,
  SiFigma,
  SiLinux,
  SiGithubactions,
} from "react-icons/si";
import { TbApi, TbNetwork } from "react-icons/tb";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GradientText } from "@/components/ui/GradientText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { skillGroups } from "@/content/skills";
import type { SkillItem } from "@/types";

// Official brand icons per technology
const SKILL_ICONS: Record<string, React.ElementType> = {
  "React": SiReact,
  "Next.js": SiNextdotjs,
  "TypeScript": SiTypescript,
  "Tailwind CSS": SiTailwindcss,
  "React Native": SiReact,
  "Framer Motion": SiFramer,
  "Node.js": SiNodedotjs,
  "Express": SiExpress,
  "Supabase": SiSupabase,
  "PostgreSQL": SiPostgresql,
  "REST APIs": TbApi,
  "WebSockets": TbNetwork,
  "Git": SiGit,
  "Docker": SiDocker,
  "Vercel": SiVercel,
  "Figma": SiFigma,
  "Linux": SiLinux,
  "CI/CD": SiGithubactions,
};

const categoryMeta: Record<string, { Icon: React.ElementType; accent: string }> = {
  Frontend: { Icon: Monitor, accent: "#6366f1" },
  Backend: { Icon: Server, accent: "#3ECF8E" },
  "Tools & DevOps": { Icon: Wrench, accent: "#F05032" },
};

// Very dark colors are invisible on dark bg → use white
function safeColor(color: string) {
  const dark = ["#000000", "#010101", "#0a0a0a"];
  return dark.includes(color.toLowerCase()) ? "#e5e7eb" : color;
}

function Skill3DCard({ skill, index }: { skill: SkillItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [rot, setRot] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setRot({
      x: -((e.clientY - r.top) / r.height - 0.5) * 22,
      y: ((e.clientX - r.left) / r.width - 0.5) * 22,
    });
  }, []);

  const Icon = SKILL_ICONS[skill.name];
  const color = safeColor(skill.color);
  const filled = Math.ceil(skill.level / 20);

  return (
    <motion.div
      animate={{ y: [0, -7, 0] }}
      transition={{
        duration: 2.6 + (index % 7) * 0.35,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.18,
      }}
      className="relative"
      style={{ perspective: 700 }}
    >
      <motion.div
        ref={ref}
        style={{ rotateX: rot.x, rotateY: rot.y, transformStyle: "preserve-3d" }}
        animate={{ scale: hovered ? 1.08 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setRot({ x: 0, y: 0 }); setHovered(false); }}
        className="relative cursor-default"
      >
        {/* Back glow */}
        <motion.div
          className="absolute -inset-2 rounded-2xl blur-xl pointer-events-none"
          animate={{ opacity: hovered ? 0.55 : 0 }}
          style={{ backgroundColor: color }}
          transition={{ duration: 0.18 }}
        />

        {/* Card face */}
        <div
          className="relative px-4 py-6 bg-surface border border-border/60 rounded-2xl flex flex-col items-center gap-3 overflow-hidden select-none"
          style={{ borderColor: hovered ? `${color}60` : undefined }}
        >
          {/* Top shimmer */}
          <motion.div
            className="absolute inset-x-0 top-0 h-px pointer-events-none"
            animate={{ opacity: hovered ? 1 : 0 }}
            style={{
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            }}
          />

          {/* Logo container */}
          <motion.div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              backgroundColor: `${color}18`,
              border: `1px solid ${color}35`,
            }}
            animate={{
              boxShadow: hovered
                ? `0 0 28px ${color}55, inset 0 0 20px ${color}18`
                : "0 0 0px transparent",
            }}
            transition={{ duration: 0.2 }}
          >
            {Icon ? (
              <Icon size={34} style={{ color, filter: hovered ? `drop-shadow(0 0 8px ${color})` : "none" }} />
            ) : (
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
            )}
          </motion.div>

          {/* Name */}
          <span className="text-foreground font-semibold text-sm text-center leading-tight">
            {skill.name}
          </span>

          {/* Level dots */}
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((dot) => (
              <div
                key={dot}
                className="w-1.5 h-1.5 rounded-full transition-all duration-200"
                style={{
                  backgroundColor: dot <= filled ? color : "transparent",
                  border: `1px solid ${dot <= filled ? color : `${color}33`}`,
                  boxShadow: dot <= filled ? `0 0 5px ${color}99` : "none",
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function SkillsSection() {
  const t = useTranslations("skills");

  return (
    <SectionWrapper id="skills" alt>
      <AnimatedSection className="text-center mb-16">
        <SectionLabel>{t("label")}</SectionLabel>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
          {t("heading")} <GradientText>{t("headingHighlight")}</GradientText>
        </h2>
        <p className="mt-4 text-foreground-secondary text-lg max-w-2xl mx-auto">
          {t("desc")}
        </p>
      </AnimatedSection>

      <div className="grid lg:grid-cols-3 gap-12">
        {skillGroups.map((group, gi) => {
          const meta = categoryMeta[group.category] ?? categoryMeta["Frontend"];
          const Icon = meta.Icon;

          return (
            <AnimatedSection key={group.category} delay={gi * 0.12}>
              {/* Category header */}
              <div className="flex items-center gap-3 mb-7">
                <div
                  className="p-2.5 rounded-xl border"
                  style={{
                    backgroundColor: `${meta.accent}18`,
                    borderColor: `${meta.accent}35`,
                  }}
                >
                  <Icon size={18} style={{ color: meta.accent }} />
                </div>
                <h3 className="font-bold text-foreground text-lg">{group.category}</h3>
                <div
                  className="flex-1 h-px"
                  style={{
                    background: `linear-gradient(90deg, ${meta.accent}40, transparent)`,
                  }}
                />
              </div>

              {/* 3D logo card grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                {group.items.map((skill, i) => (
                  <Skill3DCard key={skill.name} skill={skill} index={gi * 6 + i} />
                ))}
              </div>
            </AnimatedSection>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
