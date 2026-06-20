"use client";

import { Palette, Layers, BookOpen, Layout, Megaphone, Pen } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { DesignProject } from "@/types";

const categoryConfig: Record<
  string,
  { icon: React.ElementType; gradient: string; accent: string }
> = {
  "Logo Tasarımı": {
    icon: Pen,
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    accent: "text-amber-400",
  },
  "Marka Kimliği": {
    icon: Layers,
    gradient: "from-violet-500/20 via-purple-500/10 to-transparent",
    accent: "text-violet-400",
  },
  "Katalog": {
    icon: BookOpen,
    gradient: "from-blue-500/20 via-cyan-500/10 to-transparent",
    accent: "text-blue-400",
  },
  "UI Tasarımı": {
    icon: Layout,
    gradient: "from-indigo-500/20 via-accent/10 to-transparent",
    accent: "text-indigo-400",
  },
  "Sosyal Medya": {
    icon: Megaphone,
    gradient: "from-rose-500/20 via-pink-500/10 to-transparent",
    accent: "text-rose-400",
  },
};

const defaultConfig = {
  icon: Palette,
  gradient: "from-accent/20 via-violet-500/10 to-transparent",
  accent: "text-accent",
};

interface Props {
  project: DesignProject;
}

export function DesignCard({ project }: Props) {
  const config = categoryConfig[project.designCategory] ?? defaultConfig;
  const Icon = config.icon;

  return (
    <article className="group bg-surface border border-border rounded-2xl overflow-hidden hover:border-accent/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5 flex flex-col">
      {/* Preview area */}
      <div className={`relative h-52 bg-gradient-to-br ${config.gradient} border-b border-border overflow-hidden`}>
        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Central icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Outer ring */}
            <div className={`absolute inset-0 rounded-full blur-xl opacity-30 scale-150 bg-current ${config.accent}`} />
            <div className={`relative w-20 h-20 rounded-2xl border border-white/10 bg-background/40 backdrop-blur-sm flex items-center justify-center`}>
              <Icon size={34} className={config.accent} />
            </div>
          </div>
        </div>

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-background/60 backdrop-blur-sm border border-white/10 ${config.accent}`}>
            {project.designCategory}
          </span>
        </div>

        {/* Year */}
        <div className="absolute top-4 right-4">
          <span className="text-xs text-foreground-secondary bg-background/60 backdrop-blur-sm px-2 py-1 rounded-lg border border-border">
            {project.year}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-foreground font-bold text-lg mb-2 group-hover:text-accent transition-colors">
          {project.title}
        </h3>
        <p className="text-foreground-secondary text-sm leading-relaxed mb-5 flex-1">
          {project.description}
        </p>

        {/* Tools */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
          {project.tools.map((tool) => (
            <Badge key={tool} variant="default">
              {tool}
            </Badge>
          ))}
        </div>
      </div>
    </article>
  );
}
