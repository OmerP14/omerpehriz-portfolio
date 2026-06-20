"use client";

import { ExternalLink, Github, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/Badge";
import type { Project } from "@/types";

interface Props {
  project: Project;
}

export function ProjectCard({ project }: Props) {
  const t = useTranslations("projects");

  return (
    <article className="group bg-surface border border-border rounded-2xl overflow-hidden hover:border-accent/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5 flex flex-col">
      {/* Image */}
      <div className="relative h-52 bg-surface-elevated overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-foreground-secondary">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-3">
              <span className="text-accent font-bold text-2xl">
                {project.title.charAt(0)}
              </span>
            </div>
            <p className="text-xs">Screenshot placeholder</p>
          </div>
        </div>

        <div className="absolute top-4 left-4">
          <Badge variant="accent">{project.category}</Badge>
        </div>

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
        <p className="text-foreground-secondary text-sm leading-relaxed mb-4 flex-1">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.slice(0, 4).map((tech) => (
            <Badge key={tech} variant="default">
              {tech}
            </Badge>
          ))}
          {project.technologies.length > 4 && (
            <Badge variant="default">+{project.technologies.length - 4}</Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex gap-3">
            {project.liveUrl && project.liveUrl !== "#" && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-foreground-secondary hover:text-accent transition-colors"
                aria-label={`Live demo of ${project.title}`}
              >
                <ExternalLink size={14} />
                {t("liveDemo")}
              </a>
            )}
            {project.githubUrl && project.githubUrl !== "#" && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-foreground-secondary hover:text-accent transition-colors"
                aria-label={`GitHub repo for ${project.title}`}
              >
                <Github size={14} />
                {t("code")}
              </a>
            )}
          </div>
          <Link
            href={`/projects/${project.slug}`}
            className="flex items-center gap-1.5 text-xs text-accent hover:gap-2.5 font-medium transition-all duration-200"
          >
            {t("viewDetails")}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}
