"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";

interface StatCounterProps {
  value: string;
  label: string;
}

function parseValue(v: string): { num: number; suffix: string } {
  const match = v.match(/^(\d+)(.*)$/);
  if (!match) return { num: 0, suffix: v };
  return { num: parseInt(match[1], 10), suffix: match[2] };
}

export function StatCounter({ value, label }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [started, setStarted] = useState(false);

  const { num, suffix } = parseValue(value);

  useEffect(() => {
    if (!isInView || started || !numRef.current) return;
    setStarted(true);

    const controls = animate(0, num, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) {
        if (numRef.current) {
          numRef.current.textContent = Math.round(v).toString();
        }
      },
    });

    return () => controls.stop();
  }, [isInView, started, num]);

  return (
    <div
      ref={ref}
      className="bg-surface-elevated border border-border rounded-xl p-5 hover:border-accent/30 transition-colors group"
    >
      <div className="text-3xl font-extrabold text-accent mb-1 tabular-nums">
        <span ref={numRef}>{started ? undefined : "0"}</span>
        <span>{suffix}</span>
      </div>
      <div className="text-foreground-secondary text-sm">{label}</div>
    </div>
  );
}
