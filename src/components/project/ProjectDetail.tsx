import Image from "next/image";
import { ExternalLink, Github, ArrowLeft, Calendar, Tag, Lock, GraduationCap } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/Badge";
import { StatusBadge } from "@/components/project/StatusBadge";
import { ProjectImage } from "@/components/project/ProjectImage";
import { getGithubLinks, hasLiveDemo } from "@/lib/project-utils";
import type { Project } from "@/types";

interface Props {
  project: Project;
}

export async function ProjectDetail({ project }: Props) {
  const t = await getTranslations("projects");
  const tc = await getTranslations("contact");

  const githubLinks = getGithubLinks(project);
  const showLiveDemo = hasLiveDemo(project);
  const hasLinks = showLiveDemo || githubLinks.length > 0 || project.repoVisibility === "private";

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
            <StatusBadge status={project.status} />
            {project.tags?.map((tag) => (
              <Badge key={tag} variant="outline" className="gap-1.5">
                <GraduationCap size={12} />
                {tag}
              </Badge>
            ))}
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

        {/* Hero image */}
        <div className="relative h-72 sm:h-96 bg-surface border border-border rounded-2xl overflow-hidden mb-12">
          <ProjectImage
            src={project.image}
            alt={project.title}
            category={project.category}
            sizes="(max-width: 896px) 100vw, 896px"
            priority
          />
        </div>

        {/* Meta row */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12 p-6 bg-surface border border-border rounded-2xl">
          <div>
            <div className="flex items-center gap-2 text-foreground-secondary text-xs font-medium uppercase tracking-wider mb-2">
              <Tag size={12} />
              {t("technologiesLabel")}
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
              {t("yearLabel")}
            </div>
            <p className="text-foreground font-medium">{project.year}</p>
          </div>
          <div>
            <div className="text-foreground-secondary text-xs font-medium uppercase tracking-wider mb-2">
              {t("linksLabel")}
            </div>
            <div className="flex flex-col gap-2">
              {showLiveDemo && (
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
              {githubLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-foreground-secondary hover:text-accent transition-colors"
                >
                  <Github size={14} />
                  {link.label === "GitHub" ? t("code") : link.label}
                </a>
              ))}
              {!githubLinks.length && project.repoVisibility === "private" && (
                <span className="inline-flex items-center gap-1.5 text-sm text-foreground-secondary">
                  <Lock size={14} />
                  {t("privateRepository")}
                </span>
              )}
              {!hasLinks && (
                <span className="text-sm text-foreground-secondary">—</span>
              )}
            </div>
          </div>
        </div>

        {/* Long description */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">{t("aboutTitle")}</h2>
          <p className="text-foreground-secondary leading-relaxed text-lg">
            {project.longDescription}
          </p>
        </div>

        {/* Problem / Solution */}
        {(project.problem || project.solution) && (
          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            {project.problem && (
              <div className="p-6 bg-surface border border-border rounded-2xl">
                <h2 className="text-lg font-bold text-foreground mb-3">{t("problemTitle")}</h2>
                <p className="text-foreground-secondary leading-relaxed">{project.problem}</p>
              </div>
            )}
            {project.solution && (
              <div className="p-6 bg-surface border border-accent/20 rounded-2xl">
                <h2 className="text-lg font-bold text-foreground mb-3">{t("solutionTitle")}</h2>
                <p className="text-foreground-secondary leading-relaxed">{project.solution}</p>
              </div>
            )}
          </div>
        )}

        {/* Key features */}
        {project.features && project.features.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">{t("featuresTitle")}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {project.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-2.5 text-foreground-secondary p-3 bg-surface border border-border rounded-xl"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Screenshots gallery */}
        {project.screenshots && project.screenshots.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">{t("screenshotsTitle")}</h2>
            <div className="grid gap-4">
              {project.screenshots.map((src, i) => (
                <div key={i} className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border bg-surface">
                  <Image
                    src={src}
                    alt={`${project.title} screenshot ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 896px) 100vw, 896px"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

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
