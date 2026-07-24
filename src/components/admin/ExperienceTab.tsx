"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useAdmin } from "./AdminContext";
import { Field, TextInput, TextArea, Checkbox, ListEditor, SaveButton, LocaleTabs } from "./ui";
import type { WorkConfig, EducationConfig } from "@/content/experience";

interface WorkText {
  role: string;
  company: string;
  period: string;
  description: string;
}
interface EducationText {
  degree: string;
  institution: string;
  period: string;
  description: string;
}

type Locale = "tr" | "en";

const EMPTY_WORK_TEXT: WorkText = { role: "", company: "", period: "", description: "" };
const EMPTY_EDU_TEXT: EducationText = { degree: "", institution: "", period: "", description: "" };

export function ExperienceTab() {
  const { api, addToast } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [work, setWork] = useState<WorkConfig[]>([]);
  const [education, setEducation] = useState<EducationConfig[]>([]);

  const [workTextTr, setWorkTextTr] = useState<WorkText[]>([]);
  const [workTextEn, setWorkTextEn] = useState<WorkText[]>([]);
  const [eduTextTr, setEduTextTr] = useState<EducationText[]>([]);
  const [eduTextEn, setEduTextEn] = useState<EducationText[]>([]);

  const [nsTr, setNsTr] = useState<Record<string, unknown>>({});
  const [nsEn, setNsEn] = useState<Record<string, unknown>>({});
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = (await api("/api/admin/content")) as {
          experience: { work: WorkConfig[]; education: EducationConfig[] };
          messages: {
            tr: { experience: Record<string, unknown> & { work?: WorkText[]; education?: EducationText[] } };
            en: { experience: Record<string, unknown> & { work?: WorkText[]; education?: EducationText[] } };
          };
        };
        setWork(res.experience.work);
        setEducation(res.experience.education);
        setNsTr(res.messages.tr.experience);
        setNsEn(res.messages.en.experience);
        setWorkTextTr(res.messages.tr.experience.work ?? []);
        setWorkTextEn(res.messages.en.experience.work ?? []);
        setEduTextTr(res.messages.tr.experience.education ?? []);
        setEduTextEn(res.messages.en.experience.education ?? []);
      } catch {
        addToast("error", "Veriler yüklenemedi");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addWork = () => {
    setWork((prev) => [...prev, { type: "work", technologies: [], current: false }]);
    setWorkTextTr((prev) => [...prev, { ...EMPTY_WORK_TEXT }]);
    setWorkTextEn((prev) => [...prev, { ...EMPTY_WORK_TEXT }]);
    setExpanded(`work-${work.length}`);
  };

  const removeWork = (i: number) => {
    if (!confirm("Bu iş deneyimini silmek istediğine emin misin?")) return;
    setWork((prev) => prev.filter((_, idx) => idx !== i));
    setWorkTextTr((prev) => prev.filter((_, idx) => idx !== i));
    setWorkTextEn((prev) => prev.filter((_, idx) => idx !== i));
  };

  const addEducation = () => {
    setEducation((prev) => [...prev, { type: "education" }]);
    setEduTextTr((prev) => [...prev, { ...EMPTY_EDU_TEXT }]);
    setEduTextEn((prev) => [...prev, { ...EMPTY_EDU_TEXT }]);
    setExpanded(`edu-${education.length}`);
  };

  const removeEducation = (i: number) => {
    if (!confirm("Bu eğitim kaydını silmek istediğine emin misin?")) return;
    setEducation((prev) => prev.filter((_, idx) => idx !== i));
    setEduTextTr((prev) => prev.filter((_, idx) => idx !== i));
    setEduTextEn((prev) => prev.filter((_, idx) => idx !== i));
  };

  const save = async () => {
    setSaving(true);
    try {
      await api("/api/admin/content", {
        method: "PUT",
        body: JSON.stringify({ target: "experience", data: { work, education } }),
      });
      await api("/api/admin/content", {
        method: "PUT",
        body: JSON.stringify({
          target: "messages",
          locale: "tr",
          patch: { experience: { ...nsTr, work: workTextTr, education: eduTextTr } },
        }),
      });
      await api("/api/admin/content", {
        method: "PUT",
        body: JSON.stringify({
          target: "messages",
          locale: "en",
          patch: { experience: { ...nsEn, work: workTextEn, education: eduTextEn } },
        }),
      });
      addToast("success", "Deneyim kaydedildi");
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
          <h1 className="text-2xl font-bold">Deneyim</h1>
          <p className="text-gray-500 text-sm mt-1">İş deneyimleri ve eğitim geçmişi.</p>
        </div>
        <SaveButton onClick={save} saving={saving} label="Tümünü Kaydet" />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">İş Deneyimi</h2>
            <button
              onClick={addWork}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#1e1e38] hover:border-indigo-500/40 rounded-lg text-xs text-gray-300 transition-colors"
            >
              <Plus size={13} />
              Ekle
            </button>
          </div>
          <div className="space-y-3">
            {work.map((item, i) => (
              <WorkEditor
                key={i}
                config={item}
                textTr={workTextTr[i] ?? EMPTY_WORK_TEXT}
                textEn={workTextEn[i] ?? EMPTY_WORK_TEXT}
                expanded={expanded === `work-${i}`}
                onToggle={() => setExpanded(expanded === `work-${i}` ? null : `work-${i}`)}
                onChangeConfig={(patch) =>
                  setWork((prev) => prev.map((w, idx) => (idx === i ? { ...w, ...patch } : w)))
                }
                onChangeText={(locale, patch) => {
                  const setter = locale === "tr" ? setWorkTextTr : setWorkTextEn;
                  setter((prev) => prev.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));
                }}
                onRemove={() => removeWork(i)}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Eğitim</h2>
            <button
              onClick={addEducation}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#1e1e38] hover:border-indigo-500/40 rounded-lg text-xs text-gray-300 transition-colors"
            >
              <Plus size={13} />
              Ekle
            </button>
          </div>
          <div className="space-y-3">
            {education.map((_, i) => (
              <EducationEditor
                key={i}
                textTr={eduTextTr[i] ?? EMPTY_EDU_TEXT}
                textEn={eduTextEn[i] ?? EMPTY_EDU_TEXT}
                expanded={expanded === `edu-${i}`}
                onToggle={() => setExpanded(expanded === `edu-${i}` ? null : `edu-${i}`)}
                onChangeText={(locale, patch) => {
                  const setter = locale === "tr" ? setEduTextTr : setEduTextEn;
                  setter((prev) => prev.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));
                }}
                onRemove={() => removeEducation(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkEditor({
  config,
  textTr,
  textEn,
  expanded,
  onToggle,
  onChangeConfig,
  onChangeText,
  onRemove,
}: {
  config: WorkConfig;
  textTr: WorkText;
  textEn: WorkText;
  expanded: boolean;
  onToggle: () => void;
  onChangeConfig: (patch: Partial<WorkConfig>) => void;
  onChangeText: (locale: Locale, patch: Partial<WorkText>) => void;
  onRemove: () => void;
}) {
  const [locale, setLocale] = useState<Locale>("tr");
  const text = locale === "tr" ? textTr : textEn;

  return (
    <div className="bg-[#0d0d1a] border border-[#1e1e38] rounded-xl overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center justify-between gap-3 p-4 text-left">
        <span className="font-medium text-white text-sm truncate">
          {textTr.role || "Yeni iş deneyimi"} {textTr.company && `— ${textTr.company}`}
        </span>
        {expanded ? <ChevronUp size={16} className="text-gray-500 shrink-0" /> : <ChevronDown size={16} className="text-gray-500 shrink-0" />}
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-[#1e1e38] pt-4 space-y-4">
          <Field label="Teknolojiler">
            <ListEditor
              items={config.technologies}
              onChange={(technologies) => onChangeConfig({ technologies })}
            />
          </Field>
          <Checkbox
            checked={config.current}
            onChange={(current) => onChangeConfig({ current })}
            label="Şu anda burada çalışıyorum"
          />

          <LocaleTabs locale={locale} onChange={setLocale} />
          <Field label="Pozisyon">
            <TextInput value={text.role} onChange={(e) => onChangeText(locale, { role: e.target.value })} />
          </Field>
          <Field label="Şirket">
            <TextInput value={text.company} onChange={(e) => onChangeText(locale, { company: e.target.value })} />
          </Field>
          <Field label="Dönem (örn. 2024 - Günümüz)">
            <TextInput value={text.period} onChange={(e) => onChangeText(locale, { period: e.target.value })} />
          </Field>
          <Field label="Açıklama">
            <TextArea
              value={text.description}
              onChange={(e) => onChangeText(locale, { description: e.target.value })}
            />
          </Field>

          <button
            onClick={onRemove}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 text-xs transition-colors"
          >
            <Trash2 size={13} />
            Sil
          </button>
        </div>
      )}
    </div>
  );
}

function EducationEditor({
  textTr,
  textEn,
  expanded,
  onToggle,
  onChangeText,
  onRemove,
}: {
  textTr: EducationText;
  textEn: EducationText;
  expanded: boolean;
  onToggle: () => void;
  onChangeText: (locale: Locale, patch: Partial<EducationText>) => void;
  onRemove: () => void;
}) {
  const [locale, setLocale] = useState<Locale>("tr");
  const text = locale === "tr" ? textTr : textEn;

  return (
    <div className="bg-[#0d0d1a] border border-[#1e1e38] rounded-xl overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center justify-between gap-3 p-4 text-left">
        <span className="font-medium text-white text-sm truncate">
          {textTr.degree || "Yeni eğitim kaydı"} {textTr.institution && `— ${textTr.institution}`}
        </span>
        {expanded ? <ChevronUp size={16} className="text-gray-500 shrink-0" /> : <ChevronDown size={16} className="text-gray-500 shrink-0" />}
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-[#1e1e38] pt-4 space-y-4">
          <LocaleTabs locale={locale} onChange={setLocale} />
          <Field label="Derece / Bölüm">
            <TextInput value={text.degree} onChange={(e) => onChangeText(locale, { degree: e.target.value })} />
          </Field>
          <Field label="Kurum">
            <TextInput value={text.institution} onChange={(e) => onChangeText(locale, { institution: e.target.value })} />
          </Field>
          <Field label="Dönem">
            <TextInput value={text.period} onChange={(e) => onChangeText(locale, { period: e.target.value })} />
          </Field>
          <Field label="Açıklama">
            <TextArea
              value={text.description}
              onChange={(e) => onChangeText(locale, { description: e.target.value })}
            />
          </Field>

          <button
            onClick={onRemove}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 text-xs transition-colors"
          >
            <Trash2 size={13} />
            Sil
          </button>
        </div>
      )}
    </div>
  );
}
