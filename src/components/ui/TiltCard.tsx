"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  maxTilt?: number;
}

export function TiltCard({ children, className, glowColor = "#6366f1", maxTilt = 14 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [rot, setRot] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      setRot({
        x: -((e.clientY - r.top) / r.height - 0.5) * maxTilt,
        y: ((e.clientX - r.left) / r.width - 0.5) * maxTilt,
      });
    },
    [maxTilt]
  );

  return (
    <div style={{ perspective: 900 }} className="h-full">
      <motion.div
        ref={ref}
        style={{ rotateX: rot.x, rotateY: rot.y, transformStyle: "preserve-3d" }}
        animate={{ scale: hovered ? 1.03 : 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setRot({ x: 0, y: 0 }); setHovered(false); }}
        className={cn("relative h-full", className)}
      >
        <motion.div
          className="absolute -inset-1 rounded-2xl blur-xl pointer-events-none"
          animate={{ opacity: hovered ? 0.28 : 0 }}
          style={{ backgroundColor: glowColor }}
          transition={{ duration: 0.2 }}
        />
        <div className="relative h-full" style={{ transform: "translateZ(10px)" }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
