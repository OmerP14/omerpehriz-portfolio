"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useAdmin } from "./AdminContext";
import { Field, TextInput, TextArea, Checkbox, ListEditor, SaveButton, LocaleTabs } from "./ui";
import type { DesignProjectData } from "@/content/projects";

interface ItemText {
  title: string;
  description: string;
}

type ItemsMap = Record<string, ItemText>;
type Locale = "tr" | "en";

const EMPTY_TEXT: ItemText = { title: "", description: "" };

export function DesignProjectsTab() {
  const { api, addToast } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [projects, setProjects] = useState<DesignProjectData[]>([]);
  const [itemsTr, setItemsTr] = useState<ItemsMap>({});
  const [itemsEn, setItemsEn] = useState<ItemsMap>({});
  const [nsTr, setNsTr] = useState<Record<string, unknown>>({});
  const [nsEn, setNsEn] = useState<Record<string, unknown>>({});
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = (await api("/api/admin/content")) as {
          projects: { design: DesignProjectData[] };
          messages: {
            tr: { projects: Record<string, unknown> & { designItems?: ItemsMap } };
            en: { projects: Record<string, unknown> & { designItems?: ItemsMap } };
          };
        };
        setProjects(res.projects.design);
        setNsTr(res.messages.tr.projects);
        setNsEn(res.messages.en.projects);
        setItemsTr(res.messages.tr.projects.designItems ?? {});
        setItemsEn(res.messages.en.projects.designItems ?? {});
      } catch {
        addToast("error", "Veriler yüklenemedi");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateProject = (slug: string, patch: Partial<DesignProjectData>) => {
    setProjects((prev) => prev.map((p) => (p.slug === slug ? { ...p, ...patch } : p)));
  };

  const updateText = (locale: Locale, slug: string, patch: Partial<ItemText>) => {
    const setter = locale === "tr" ? setItemsTr : setItemsEn;
    setter((prev) => ({ ...prev, [slug]: { ...(prev[slug] ?? EMPTY_TEXT), ...patch } }));
  };

  const addProject = () => {
    const slug = prompt("Yeni tasarım işi için slug gir (örn: new-brand-identity):")?.trim();
    if (!slug) return;
    if (projects.some((p) => p.slug === slug)) {
      addToast("error", "Bu slug zaten kullanılıyor");
      return;
    }
    const nextId = Math.max(100, ...projects.map((p) => p.id)) + 1;
    const blank: DesignProjectData = {
      id: nextId,
      slug,
      type: "design",
      designCategory: "",
      tools: [],
      featured: false,
      image: "",
      year: String(new Date().getFullYear()),
    };
    setProjects((prev) => [...prev, blank]);
    setItemsTr((prev) => ({ ...prev, [slug]: { ...EMPTY_TEXT, title: slug } }));
    setItemsEn((prev) => ({ ...prev, [slug]: { ...EMPTY_TEXT, title: slug } }));
    setExpanded(slug);
  };

  const removeProject = (slug: string) => {
    if (!confirm(`"${slug}" işini silmek istediğine emin misin?`)) return;
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
        body: JSON.stringify({ target: "design-projects", data: projects }),
      });
      await api("/api/admin/content", {
        method: "PUT",
        body: JSON.stringify({
          target: "messages",
          locale: "tr",
          patch: { projects: { ...nsTr, designItems: itemsTr } },
        }),
      });
      await api("/api/admin/content", {
        method: "PUT",
        body: JSON.stringify({
          target: "messages",
          locale: "en",
          patch: { projects: { ...nsEn, designItems: itemsEn } },
        }),
      });
      addToast("success", "Tasarım işleri kaydedildi");
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
          <h1 className="text-2xl font-bold">Tasarım Projeleri</h1>
          <p className="text-gray-500 text-sm mt-1">
            Bu işlerin görseli yok — kart üzerinde kategoriye göre otomatik ikon/gradient gösteriliyor.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={addProject}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#1e1e38] hover:border-indigo-500/40 rounded-xl text-sm text-gray-300 transition-colors"
          >
            <Plus size={15} />
            İş Ekle
          </button>
          <SaveButton onClick={save} saving={saving} label="Tümünü Kaydet" />
        </div>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <DesignEditor
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

function DesignEditor({
  project,
  textTr,
  textEn,
  expanded,
  onToggle,
  onChange,
  onChangeText,
  onRemove,
}: {
  project: DesignProjectData;
  textTr: ItemText;
  textEn: ItemText;
  expanded: boolean;
  onToggle: () => void;
  onChange: (patch: Partial<DesignProjectData>) => void;
  onChangeText: (locale: Locale, patch: Partial<ItemText>) => void;
  onRemove: () => void;
}) {
  const [locale, setLocale] = useState<Locale>("tr");
  const text = locale === "tr" ? textTr : textEn;

  return (
    <div className="bg-[#0d0d1a] border border-[#1e1e38] rounded-2xl overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center justify-between gap-3 p-5 text-left">
        <div className="flex items-center gap-3 min-w-0">
          <span className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            {project.designCategory || "—"}
          </span>
          <span className="font-semibold text-white truncate">{textTr.title || project.slug}</span>
          <span className="text-gray-600 text-xs shrink-0">{project.slug}</span>
        </div>
        {expanded ? <ChevronUp size={18} className="text-gray-500 shrink-0" /> : <ChevronDown size={18} className="text-gray-500 shrink-0" />}
      </button>

      {expanded && (
        <div className="px-5 pb-5 grid lg:grid-cols-2 gap-6 border-t border-[#1e1e38] pt-5">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Kategori">
                <TextInput
                  value={project.designCategory}
                  onChange={(e) => onChange({ designCategory: e.target.value })}
                  placeholder="Marka Kimliği"
                />
              </Field>
              <Field label="Yıl">
                <TextInput value={project.year} onChange={(e) => onChange({ year: e.target.value })} />
              </Field>
            </div>

            <Field label="Araçlar">
              <ListEditor
                items={project.tools}
                onChange={(tools) => onChange({ tools })}
                placeholder="Adobe Illustrator, Figma, ..."
              />
            </Field>

            <Checkbox
              checked={project.featured}
              onChange={(featured) => onChange({ featured })}
              label="Öne çıkan"
            />

            <div className="pt-2">
              <button
                onClick={onRemove}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 text-xs transition-colors"
              >
                <Trash2 size={13} />
                İşi Sil
              </button>
            </div>
          </div>

          <div>
            <LocaleTabs locale={locale} onChange={setLocale} />
            <div className="space-y-4">
              <Field label="Başlık">
                <TextInput value={text.title} onChange={(e) => onChangeText(locale, { title: e.target.value })} />
              </Field>
              <Field label="Açıklama">
                <TextArea
                  value={text.description}
                  onChange={(e) => onChangeText(locale, { description: e.target.value })}
                />
              </Field>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
