"use client";

import { useState } from "react";
import Image from "next/image";
import {
  LayoutDashboard,
  BrainCircuit,
  Globe,
  Smartphone,
  Cpu,
  Wifi,
  LayoutTemplate,
  Terminal,
  Code2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const categoryConfig: Record<string, { icon: React.ElementType; gradient: string; accent: string }> = {
  "SaaS Platform": {
    icon: LayoutDashboard,
    gradient: "from-indigo-500/25 via-violet-500/10 to-transparent",
    accent: "text-indigo-400",
  },
  "AI Web Application": {
    icon: BrainCircuit,
    gradient: "from-violet-500/25 via-fuchsia-500/10 to-transparent",
    accent: "text-violet-400",
  },
  "Full-Stack Web Application": {
    icon: Globe,
    gradient: "from-blue-500/25 via-indigo-500/10 to-transparent",
    accent: "text-blue-400",
  },
  "Mobile Application": {
    icon: Smartphone,
    gradient: "from-emerald-500/25 via-cyan-500/10 to-transparent",
    accent: "text-emerald-400",
  },
  "Embedded Systems": {
    icon: Cpu,
    gradient: "from-red-500/25 via-orange-500/10 to-transparent",
    accent: "text-red-400",
  },
  "IoT Project": {
    icon: Wifi,
    gradient: "from-cyan-500/25 via-blue-500/10 to-transparent",
    accent: "text-cyan-400",
  },
  "Portfolio Website": {
    icon: LayoutTemplate,
    gradient: "from-accent/25 via-fuchsia-500/10 to-transparent",
    accent: "text-accent-light",
  },
  "Python Automation": {
    icon: Terminal,
    gradient: "from-slate-500/25 via-accent/10 to-transparent",
    accent: "text-slate-300",
  },
};

const defaultConfig = {
  icon: Code2,
  gradient: "from-accent/25 via-violet-500/10 to-transparent",
  accent: "text-accent",
};

interface Props {
  src?: string;
  alt: string;
  category: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/**
 * Renders the project screenshot, falling back to a themed gradient + icon
 * placeholder whenever the image is missing or fails to load (404, corrupt file, etc).
 */
export function ProjectImage({ src, alt, category, sizes, priority, className }: Props) {
  const [errored, setErrored] = useState(false);
  const config = categoryConfig[category] ?? defaultConfig;
  const Icon = config.icon;

  if (!src || errored) {
    return (
      <div className={cn(`relative w-full h-full bg-gradient-to-br ${config.gradient} overflow-hidden`, className)}>
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className={`absolute inset-0 rounded-full blur-xl opacity-30 scale-150 bg-current ${config.accent}`} />
            <div className="relative w-16 h-16 rounded-2xl border border-white/10 bg-background/40 backdrop-blur-sm flex items-center justify-center">
              <Icon size={28} className={config.accent} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={cn("object-cover", className)}
      sizes={sizes}
      priority={priority}
      onError={() => setErrored(true)}
    />
  );
}
