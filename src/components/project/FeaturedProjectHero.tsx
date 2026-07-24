"use client";

import { Sparkles, Check, ExternalLink, Github, Lock, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/Badge";
import { StatusBadge } from "@/components/project/StatusBadge";
import { ProjectImage } from "@/components/project/ProjectImage";
import { getGithubLinks, hasLiveDemo } from "@/lib/project-utils";
import type { Project } from "@/types";

interface Props {
  project: Project;
}

export function FeaturedProjectHero({ project }: Props) {
  const t = useTranslations("projects");
  const githubLinks = getGithubLinks(project);
  const showLiveDemo = hasLiveDemo(project);
  const features = project.features?.slice(0, 8) ?? [];

  return (
    <article className="group relative bg-surface border border-accent/20 rounded-2xl overflow-hidden hover:border-accent/40 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10 mb-8">
      <div className="grid lg:grid-cols-2">
        {/* Image */}
        <div className="relative h-64 sm:h-80 lg:h-auto overflow-hidden bg-surface-elevated">
          <ProjectImage
            src={project.image}
            alt={project.title}
            category={project.category}
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            className="group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-background/10" />

          <div className="absolute top-5 left-5 flex flex-col items-start gap-2">
            <Badge variant="accent">{project.category}</Badge>
            <StatusBadge status={project.status} />
          </div>
          <div className="absolute top-5 right-5">
            <span className="text-xs text-foreground-secondary bg-background/70 backdrop-blur-sm px-2 py-1 rounded-lg border border-border/50">
              {project.year}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 lg:p-10 flex flex-col">
          <div className="inline-flex items-center gap-1.5 text-accent text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles size={14} />
            {t("featuredLabel")}
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors">
            {project.title}
          </h3>
          <p className="text-foreground-secondary leading-relaxed mb-6">
            {project.description}
          </p>

          {features.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2.5 mb-6">
              {features.map((feature) => (
                <div key={feature} className="flex items-start gap-2 text-sm text-foreground-secondary">
                  <Check size={15} className="text-accent shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-8">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="default">
                {tech}
              </Badge>
            ))}
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-4 pt-6 border-t border-border">
            <div className="flex flex-wrap items-center gap-4">
              {showLiveDemo && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-foreground-secondary hover:text-accent transition-colors"
                >
                  <ExternalLink size={15} />
                  {t("liveDemo")}
                </a>
              )}
              {githubLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-foreground-secondary hover:text-accent transition-colors"
                >
                  <Github size={15} />
                  {link.label === "GitHub" ? t("code") : link.label}
                </a>
              ))}
              {!githubLinks.length && project.repoVisibility === "private" && (
                <span className="flex items-center gap-1.5 text-sm text-foreground-secondary">
                  <Lock size={15} />
                  {t("privateRepository")}
                </span>
              )}
            </div>
            <Link
              href={`/projects/${project.slug}`}
              className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-light text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/30"
            >
              {t("viewDetails")}
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
