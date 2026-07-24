"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GradientText } from "@/components/ui/GradientText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { TestimonialData } from "@/content/testimonials";
import type { Testimonial } from "@/types";

interface Props {
  testimonials: TestimonialData[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-border"}
        />
      ))}
    </div>
  );
}

export function TestimonialsSection({ testimonials: testimonialsData }: Props) {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const t = useTranslations("testimonials");

  const items = t.raw("items") as Record<string, { role: string; content: string }>;
  const testimonials: Testimonial[] = testimonialsData.map((td) => ({
    ...td,
    ...(items[td.id] ?? { role: "", content: "" }),
  }));

  const go = (next: number) => {
    setDir(next > current ? 1 : -1);
    setCurrent(next);
  };

  const prev = () => go(current === 0 ? testimonials.length - 1 : current - 1);
  const next = () => go(current === testimonials.length - 1 ? 0 : current + 1);

  const item = testimonials[current];

  return (
    <SectionWrapper id="testimonials" alt>
      <AnimatedSection className="text-center mb-16">
        <SectionLabel>{t("label")}</SectionLabel>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
          {t("heading")} <GradientText>{t("headingHighlight")}</GradientText>
        </h2>
      </AnimatedSection>

      <div style={{ maxWidth: "48rem", marginLeft: "auto", marginRight: "auto" }}>
        <div className="relative overflow-hidden bg-background border border-border rounded-3xl p-8 sm:p-12 mb-8">
          <div className="absolute top-8 right-8 text-accent/10">
            <Quote size={64} />
          </div>

          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={current}
              custom={dir}
              initial={{ opacity: 0, x: dir * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -60 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              <StarRating rating={item.rating} />
              <blockquote className="mt-6 text-foreground text-xl sm:text-2xl leading-relaxed font-medium">
                &ldquo;{item.content}&rdquo;
              </blockquote>
              <div className="mt-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold text-lg shrink-0">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{item.name}</p>
                  <p className="text-foreground-secondary text-sm">
                    {item.role}, {item.company}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? "w-8 bg-accent" : "w-2 bg-border hover:bg-muted"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={prev}
              className="p-2.5 border border-border hover:border-accent/40 rounded-xl text-foreground-secondary hover:text-accent transition-all duration-200"
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="p-2.5 border border-border hover:border-accent/40 rounded-xl text-foreground-secondary hover:text-accent transition-all duration-200"
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3 mt-6">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              onClick={() => go(i)}
              className={`p-3 border rounded-xl text-left transition-all duration-200 ${
                i === current
                  ? "border-accent/40 bg-accent/5"
                  : "border-border hover:border-accent/20 bg-background"
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-bold mb-1 mx-auto">
                {t.name.charAt(0)}
              </div>
              <p className="text-xs text-foreground-secondary text-center truncate">{t.name.split(" ")[0]}</p>
            </button>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
