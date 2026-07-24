"use client";

import { ExternalLink, Github, ArrowRight, Lock } from "lucide-react";
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

export function ProjectCard({ project }: Props) {
  const t = useTranslations("projects");
  const githubLinks = getGithubLinks(project);
  const showLiveDemo = hasLiveDemo(project);

  return (
    <article className="group h-full bg-surface border border-border rounded-2xl overflow-hidden hover:border-accent/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5 flex flex-col">
      {/* Image */}
      <div className="relative h-52 bg-surface-elevated overflow-hidden">
        <ProjectImage
          src={project.image}
          alt={project.title}
          category={project.category}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-4 left-4 flex flex-col items-start gap-2">
          <Badge variant="accent">{project.category}</Badge>
          <StatusBadge status={project.status} />
        </div>
        <div className="absolute top-4 right-4">
          <span className="text-xs text-foreground-secondary bg-background/70 backdrop-blur-sm px-2 py-1 rounded-lg border border-border/50">
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
          <div className="flex flex-wrap items-center gap-3">
            {showLiveDemo && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-foreground-secondary hover:text-accent transition-colors"
              >
                <ExternalLink size={14} />
                {t("liveDemo")}
              </a>
            )}
            {githubLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-foreground-secondary hover:text-accent transition-colors"
              >
                <Github size={14} />
                {link.label === "GitHub" ? t("code") : link.label}
              </a>
            ))}
            {!githubLinks.length && project.repoVisibility === "private" && (
              <span className="flex items-center gap-1.5 text-xs text-foreground-secondary">
                <Lock size={14} />
                {t("privateRepository")}
              </span>
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
