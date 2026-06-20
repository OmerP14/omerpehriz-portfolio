import { ExternalLink, Github, ArrowLeft, Calendar, Tag } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/Badge";
import type { Project } from "@/types";

interface Props {
  project: Project;
}

export async function ProjectDetail({ project }: Props) {
  const t = await getTranslations("projects");
  const tc = await getTranslations("contact");

  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="layout-container" style={{ maxWidth: "56rem" }}>
        {/* Back */}
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-foreground-secondary hover:text-accent text-sm mb-12 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          {t("moreProjects")}
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="accent">{project.category}</Badge>
            <div className="flex items-center gap-1.5 text-foreground-secondary text-sm">
              <Calendar size={14} />
              {project.year}
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            {project.title}
          </h1>
          <p className="text-xl text-foreground-secondary leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Hero image placeholder */}
        <div className="h-72 sm:h-96 bg-surface border border-border rounded-2xl overflow-hidden mb-12 flex items-center justify-center">
          <div className="text-center text-foreground-secondary">
            <div className="w-20 h-20 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-accent font-bold text-3xl">
                {project.title.charAt(0)}
              </span>
            </div>
            <p className="text-sm">Project screenshot</p>
          </div>
        </div>

        {/* Meta row */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12 p-6 bg-surface border border-border rounded-2xl">
          <div>
            <div className="flex items-center gap-2 text-foreground-secondary text-xs font-medium uppercase tracking-wider mb-2">
              <Tag size={12} />
              Technologies
            </div>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <Badge key={tech} variant="default">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <div className="text-foreground-secondary text-xs font-medium uppercase tracking-wider mb-2">
              Year
            </div>
            <p className="text-foreground font-medium">{project.year}</p>
          </div>
          <div>
            <div className="text-foreground-secondary text-xs font-medium uppercase tracking-wider mb-2">
              Links
            </div>
            <div className="flex flex-col gap-2">
              {project.liveUrl && project.liveUrl !== "#" && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-light transition-colors"
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
                  className="inline-flex items-center gap-1.5 text-sm text-foreground-secondary hover:text-accent transition-colors"
                >
                  <Github size={14} />
                  {t("code")}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Long description */}
        <div className="prose prose-invert prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-foreground mb-4">About this project</h2>
          <p className="text-foreground-secondary leading-relaxed text-lg">
            {project.longDescription}
          </p>
        </div>

        {/* CTA */}
        <div className="mt-16 p-8 bg-surface border border-border rounded-2xl text-center">
          <h3 className="text-xl font-bold text-foreground mb-2">
            {tc("availableTitle")}
          </h3>
          <p className="text-foreground-secondary mb-6">
            {tc("availableDesc")}
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-light text-white font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/30"
          >
            {tc("heading")} {tc("headingHighlight")}
          </Link>
        </div>
      </div>
    </div>
  );
}
