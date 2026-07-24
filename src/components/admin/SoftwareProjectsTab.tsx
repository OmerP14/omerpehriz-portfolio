"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, Plus, Trash2, Upload, Loader2, X } from "lucide-react";
import { useAdmin } from "./AdminContext";
import {
  Field,
  TextInput,
  TextArea,
  Select,
  Checkbox,
  ListEditor,
  SaveButton,
  LocaleTabs,
} from "./ui";
import type { SoftwareProjectData, GithubLink } from "@/content/projects";

interface ItemText {
  title: string;
  description: string;
  longDescription: string;
  problem?: string;
  solution?: string;
  features?: string[];
}

type ItemsMap = Record<string, ItemText>;
type Locale = "tr" | "en";

const EMPTY_TEXT: ItemText = { title: "", description: "", longDescription: "" };

const STATUS_OPTIONS = [
  "In Active Development",
  "Prototype",
  "Academic Project",
  "Graduation Project",
  "In Development",
  "Utility Project",
];

export function SoftwareProjectsTab() {
  const { api, addToast } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [projects, setProjects] = useState<SoftwareProjectData[]>([]);
  const [itemsTr, setItemsTr] = useState<ItemsMap>({});
  const [itemsEn, setItemsEn] = useState<ItemsMap>({});
  const [nsTr, setNsTr] = useState<Record<string, unknown>>({});
  const [nsEn, setNsEn] = useState<Record<string, unknown>>({});
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = (await api("/api/admin/content")) as {
          projects: { software: SoftwareProjectData[] };
          messages: {
            tr: { projects: Record<string, unknown> & { items?: ItemsMap } };
            en: { projects: Record<string, unknown> & { items?: ItemsMap } };
          };
        };
        setProjects(res.projects.software);
        setNsTr(res.messages.tr.projects);
        setNsEn(res.messages.en.projects);
        setItemsTr(res.messages.tr.projects.items ?? {});
        setItemsEn(res.messages.en.projects.items ?? {});
      } catch {
        addToast("error", "Veriler yüklenemedi");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateProject = (slug: string, patch: Partial<SoftwareProjectData>) => {
    setProjects((prev) => prev.map((p) => (p.slug === slug ? { ...p, ...patch } : p)));
  };

  const updateText = (locale: Locale, slug: string, patch: Partial<ItemText>) => {
    const setter = locale === "tr" ? setItemsTr : setItemsEn;
    setter((prev) => ({ ...prev, [slug]: { ...(prev[slug] ?? EMPTY_TEXT), ...patch } }));
  };

  const addProject = () => {
    const slug = prompt("Yeni proje için slug gir (örn: my-new-project):")?.trim();
    if (!slug) return;
    if (projects.some((p) => p.slug === slug)) {
      addToast("error", "Bu slug zaten kullanılıyor");
      return;
    }
    const nextId = Math.max(0, ...projects.map((p) => p.id)) + 1;
    const blank: SoftwareProjectData = {
      id: nextId,
      slug,
      type: "software",
      technologies: [],
      category: "",
      featured: false,
      image: `/projects/${slug}.webp`,
      screenshots: [],
      year: String(new Date().getFullYear()),
      status: "In Development",
      repoVisibility: "none",
    };
    setProjects((prev) => [...prev, blank]);
    setItemsTr((prev) => ({ ...prev, [slug]: { ...EMPTY_TEXT, title: slug } }));
    setItemsEn((prev) => ({ ...prev, [slug]: { ...EMPTY_TEXT, title: slug } }));
    setExpanded(slug);
  };

  const removeProject = (slug: string) => {
    if (!confirm(`"${slug}" projesini silmek istediğine emin misin?`)) return;
    setProjects((prev) => prev.filter((p) => p.slug !== slug));
    setItemsTr((prev) => {
      const next = { ...prev };
      delete next[slug];
      return next;
    });
    setItemsEn((prev) => {
      const next = { ...prev };
      delete next[slug];
      return next;
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      await api("/api/admin/content", {
        method: "PUT",
        body: JSON.stringify({ target: "software-projects", data: projects }),
      });
      await api("/api/admin/content", {
        method: "PUT",
        body: JSON.stringify({
          target: "messages",
          locale: "tr",
          patch: { projects: { ...nsTr, items: itemsTr } },
        }),
      });
      await api("/api/admin/content", {
        method: "PUT",
        body: JSON.stringify({
          target: "messages",
          locale: "en",
          patch: { projects: { ...nsEn, items: itemsEn } },
        }),
      });
      addToast("success", "Yazılım projeleri kaydedildi");
    } catch (e) {
      addToast("error", e instanceof Error ? e.message : "Kaydetme başarısız");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-500 text-sm">Yükleniyor...</p>;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Yazılım Projeleri</h1>
          <p className="text-gray-500 text-sm mt-1">
            Kartlarda ve detay sayfasında görünen tüm alanlar.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={addProject}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#1e1e38] hover:border-indigo-500/40 rounded-xl text-sm text-gray-300 transition-colors"
          >
            <Plus size={15} />
            Proje Ekle
          </button>
          <SaveButton onClick={save} saving={saving} label="Tümünü Kaydet" />
        </div>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <ProjectEditor
            key={project.slug}
            project={project}
            textTr={itemsTr[project.slug] ?? EMPTY_TEXT}
            textEn={itemsEn[project.slug] ?? EMPTY_TEXT}
            expanded={expanded === project.slug}
            onToggle={() => setExpanded(expanded === project.slug ? null : project.slug)}
            onChange={(patch) => updateProject(project.slug, patch)}
            onChangeText={(locale, patch) => updateText(locale, project.slug, patch)}
            onRemove={() => removeProject(project.slug)}
          />
        ))}
      </div>
    </div>
  );
}

function ProjectEditor({
  project,
  textTr,
  textEn,
  expanded,
  onToggle,
  onChange,
  onChangeText,
  onRemove,
}: {
  project: SoftwareProjectData;
  textTr: ItemText;
  textEn: ItemText;
  expanded: boolean;
  onToggle: () => void;
  onChange: (patch: Partial<SoftwareProjectData>) => void;
  onChangeText: (locale: Locale, patch: Partial<ItemText>) => void;
  onRemove: () => void;
}) {
  const [locale, setLocale] = useState<Locale>("tr");
  const text = locale === "tr" ? textTr : textEn;

  return (
    <div className="bg-[#0d0d1a] border border-[#1e1e38] rounded-2xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 p-5 text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            {project.category || "—"}
          </span>
          <span className="font-semibold text-white truncate">{textTr.title || project.slug}</span>
          <span className="text-gray-600 text-xs shrink-0">{project.slug}</span>
        </div>
        {expanded ? <ChevronUp size={18} className="text-gray-500 shrink-0" /> : <ChevronDown size={18} className="text-gray-500 shrink-0" />}
      </button>

      {expanded && (
        <div className="px-5 pb-5 grid lg:grid-cols-2 gap-6 border-t border-[#1e1e38] pt-5">
          {/* Structural fields */}
          <div className="space-y-4">
            <MainImageField project={project} onChange={onChange} />

            <div className="grid grid-cols-2 gap-3">
              <Field label="Kategori">
                <TextInput
                  value={project.category}
                  onChange={(e) => onChange({ category: e.target.value })}
                  placeholder="SaaS Platform"
                />
              </Field>
              <Field label="Yıl">
                <TextInput value={project.year} onChange={(e) => onChange({ year: e.target.value })} />
              </Field>
            </div>

            <Field label="Durum (status)">
              <TextInput
                list={`status-options-${project.slug}`}
                value={project.status}
                onChange={(e) => onChange({ status: e.target.value })}
              />
              <datalist id={`status-options-${project.slug}`}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </Field>

            <Field label="Teknolojiler">
              <ListEditor
                items={project.technologies}
                onChange={(technologies) => onChange({ technologies })}
                placeholder="Next.js, React, ..."
              />
            </Field>

            <div className="flex flex-wrap gap-4">
              <Checkbox
                checked={project.featured}
                onChange={(featured) => onChange({ featured })}
                label="Öne çıkan"
              />
              <Checkbox
                checked={!!project.hero}
                onChange={(hero) => onChange({ hero })}
                label="Hero (büyük vitrin kartı)"
              />
            </div>

            <Field label="Repo görünürlüğü">
              <Select
                value={project.repoVisibility}
                onChange={(v) => onChange({ repoVisibility: v as SoftwareProjectData["repoVisibility"] })}
                options={[
                  { value: "public", label: "Public (GitHub linki göster)" },
                  { value: "private", label: "Private (\"Private Repository\" etiketi göster)" },
                  { value: "none", label: "None (hiçbir şey gösterme)" },
                ]}
              />
            </Field>

            {project.repoVisibility === "public" && (
              <Field label="GitHub URL">
                <TextInput
                  value={project.githubUrl ?? ""}
                  onChange={(e) => onChange({ githubUrl: e.target.value || undefined })}
                  placeholder="https://github.com/..."
                />
              </Field>
            )}

            <Field label="Canlı demo URL (varsa)">
              <TextInput
                value={project.liveUrl ?? ""}
                onChange={(e) => onChange({ liveUrl: e.target.value || undefined })}
                placeholder="Yoksa boş bırak"
              />
            </Field>

            <Field label="Ekstra repo linkleri (frontend/backend gibi)">
              <GithubLinksEditor
                links={project.githubLinks ?? []}
                onChange={(githubLinks) => onChange({ githubLinks: githubLinks.length ? githubLinks : undefined })}
              />
            </Field>

            <Field label="Etiketler (detay sayfası, örn. University Graduation Project)">
              <ListEditor
                items={project.tags ?? []}
                onChange={(tags) => onChange({ tags: tags.length ? tags : undefined })}
                placeholder="Etiket ekle"
              />
            </Field>

            <div className="pt-2">
              <button
                onClick={onRemove}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 text-xs transition-colors"
              >
                <Trash2 size={13} />
                Projeyi Sil
              </button>
            </div>
          </div>

          {/* Localized text */}
          <div>
            <LocaleTabs locale={locale} onChange={setLocale} />
            <div className="space-y-4">
              <Field label="Başlık">
                <TextInput
                  value={text.title}
                  onChange={(e) => onChangeText(locale, { title: e.target.value })}
                />
              </Field>
              <Field label="Kısa açıklama (kart)">
                <TextArea
                  value={text.description}
                  onChange={(e) => onChangeText(locale, { description: e.target.value })}
                />
              </Field>
              <Field label="Uzun açıklama (Proje Hakkında)">
                <TextArea
                  value={text.longDescription}
                  onChange={(e) => onChangeText(locale, { longDescription: e.target.value })}
                />
              </Field>
              <Field label="Problem (opsiyonel)">
                <TextArea
                  value={text.problem ?? ""}
                  onChange={(e) => onChangeText(locale, { problem: e.target.value || undefined })}
                />
              </Field>
              <Field label="Çözüm (opsiyonel)">
                <TextArea
                  value={text.solution ?? ""}
                  onChange={(e) => onChangeText(locale, { solution: e.target.value || undefined })}
                />
              </Field>
              <Field label="Özellikler (opsiyonel)">
                <ListEditor
                  items={text.features ?? []}
                  onChange={(features) => onChangeText(locale, { features: features.length ? features : undefined })}
                  placeholder="Özellik ekle"
                />
              </Field>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MainImageField({
  project,
  onChange,
}: {
  project: SoftwareProjectData;
  onChange: (patch: Partial<SoftwareProjectData>) => void;
}) {
  const { password, addToast } = useAdmin();
  const [uploading, setUploading] = useState(false);
  const [version, setVersion] = useState(() => Date.now());
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("slug", project.slug);
      body.append("type", "main");
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "x-admin-password": password },
        body,
      });
      if (res.ok) {
        const { path } = (await res.json()) as { path: string };
        onChange({ image: path });
        setVersion(Date.now());
        addToast("success", "Ana görsel güncellendi");
      } else {
        addToast("error", "Yükleme başarısız");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <Field label="Ana görsel (kart + hero)">
      <div className="flex items-center gap-3">
        <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-[#1e1e38] bg-[#141428] shrink-0">
          <Image
            src={`${project.image}?v=${version}`}
            alt={project.slug}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-lg text-indigo-400 text-xs transition-colors disabled:opacity-50"
        >
          {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
          Ana görseli değiştir
        </button>
      </div>
    </Field>
  );
}

function GithubLinksEditor({
  links,
  onChange,
}: {
  links: GithubLink[];
  onChange: (links: GithubLink[]) => void;
}) {
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");

  const add = () => {
    if (!label.trim() || !url.trim()) return;
    onChange([...links, { label: label.trim(), url: url.trim() }]);
    setLabel("");
    setUrl("");
  };

  return (
    <div className="space-y-2">
      {links.map((link, i) => (
        <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
          <span className="px-2 py-1 bg-[#141428] border border-[#1e1e38] rounded-md">{link.label}</span>
          <span className="truncate text-gray-500">{link.url}</span>
          <button
            onClick={() => onChange(links.filter((_, idx) => idx !== i))}
            className="ml-auto text-gray-500 hover:text-red-400"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      <div className="flex gap-2">
        <TextInput
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Frontend"
          className="w-1/3"
        />
        <TextInput
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://github.com/..."
        />
        <button
          type="button"
          onClick={add}
          className="shrink-0 px-3 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-lg text-indigo-400"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
