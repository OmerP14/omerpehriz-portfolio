"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Upload, Loader2 } from "lucide-react";
import { useAdmin } from "./AdminContext";
import { Field, TextInput, TextArea, SaveButton, LocaleTabs } from "./ui";

interface AboutNs {
  label: string;
  heading: string;
  headingHighlight: string;
  cap1Title: string;
  cap1Desc: string;
  cap2Title: string;
  cap2Desc: string;
  cap3Title: string;
  cap3Desc: string;
  cap4Title: string;
  cap4Desc: string;
  valueShip: string;
  valueCode: string;
  valueDesign: string;
  [key: string]: unknown;
}

interface PersonalBio {
  bio1: string;
  bio2: string;
  bio3: string;
  [key: string]: unknown;
}

type Locale = "tr" | "en";

const EMPTY_ABOUT: AboutNs = {
  label: "",
  heading: "",
  headingHighlight: "",
  cap1Title: "",
  cap1Desc: "",
  cap2Title: "",
  cap2Desc: "",
  cap3Title: "",
  cap3Desc: "",
  cap4Title: "",
  cap4Desc: "",
  valueShip: "",
  valueCode: "",
  valueDesign: "",
};

const EMPTY_BIO: PersonalBio = { bio1: "", bio2: "", bio3: "" };

export function AboutTab() {
  const { api, addToast, password } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarVersion, setAvatarVersion] = useState(() => Date.now());
  const [locale, setLocale] = useState<Locale>("tr");
  const fileRef = useRef<HTMLInputElement>(null);

  const [aboutTr, setAboutTr] = useState<AboutNs>(EMPTY_ABOUT);
  const [aboutEn, setAboutEn] = useState<AboutNs>(EMPTY_ABOUT);
  const [personalTr, setPersonalTr] = useState<PersonalBio>(EMPTY_BIO);
  const [personalEn, setPersonalEn] = useState<PersonalBio>(EMPTY_BIO);
  const [nsPersonalTr, setNsPersonalTr] = useState<Record<string, unknown>>({});
  const [nsPersonalEn, setNsPersonalEn] = useState<Record<string, unknown>>({});

  useEffect(() => {
    (async () => {
      try {
        const res = (await api("/api/admin/content")) as {
          messages: {
            tr: { about: AboutNs; personal: Record<string, unknown> & PersonalBio };
            en: { about: AboutNs; personal: Record<string, unknown> & PersonalBio };
          };
        };
        setAboutTr(res.messages.tr.about);
        setAboutEn(res.messages.en.about);
        setPersonalTr(res.messages.tr.personal);
        setPersonalEn(res.messages.en.personal);
        setNsPersonalTr(res.messages.tr.personal);
        setNsPersonalEn(res.messages.en.personal);
      } catch {
        addToast("error", "Veriler yüklenemedi");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const about = locale === "tr" ? aboutTr : aboutEn;
  const setAbout = locale === "tr" ? setAboutTr : setAboutEn;
  const bio = locale === "tr" ? personalTr : personalEn;
  const setBio = locale === "tr" ? setPersonalTr : setPersonalEn;

  const uploadAvatar = async (file: File) => {
    setUploadingAvatar(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("type", "avatar");
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "x-admin-password": password },
        body,
      });
      if (res.ok) {
        setAvatarVersion(Date.now());
        addToast("success", "Profil fotoğrafı güncellendi");
      } else {
        addToast("error", "Yükleme başarısız");
      }
    } finally {
      setUploadingAvatar(false);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      await api("/api/admin/content", {
        method: "PUT",
        body: JSON.stringify({ target: "messages", locale: "tr", patch: { about: aboutTr, personal: { ...nsPersonalTr, ...personalTr } } }),
      });
      await api("/api/admin/content", {
        method: "PUT",
        body: JSON.stringify({ target: "messages", locale: "en", patch: { about: aboutEn, personal: { ...nsPersonalEn, ...personalEn } } }),
      });
      addToast("success", "Hakkımda içeriği kaydedildi");
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
          <h1 className="text-2xl font-bold">Hakkımda</h1>
          <p className="text-gray-500 text-sm mt-1">Profil fotoğrafı, tanıtım metni ve yetenek kartları.</p>
        </div>
        <SaveButton onClick={save} saving={saving} label="Kaydet" />
      </div>

      <div className="mb-8">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
          Profil Fotoğrafı
        </p>
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-[#1e1e38] bg-[#141428] shrink-0">
            <Image
              src={`/images/profile/avatar.jpg?v=${avatarVersion}`}
              alt="avatar"
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
            onChange={(e) => e.target.files?.[0] && uploadAvatar(e.target.files[0])}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploadingAvatar}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-lg text-indigo-400 text-sm transition-colors"
          >
            {uploadingAvatar ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            Fotoğrafı değiştir
          </button>
        </div>
      </div>

      <LocaleTabs locale={locale} onChange={setLocale} />

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="font-semibold text-white text-sm">Tanıtım Metni (bio)</h2>
          <Field label="Paragraf 1">
            <TextArea value={bio.bio1} onChange={(e) => setBio({ ...bio, bio1: e.target.value })} />
          </Field>
          <Field label="Paragraf 2">
            <TextArea value={bio.bio2} onChange={(e) => setBio({ ...bio, bio2: e.target.value })} />
          </Field>
          <Field label="Paragraf 3">
            <TextArea value={bio.bio3} onChange={(e) => setBio({ ...bio, bio3: e.target.value })} />
          </Field>
        </div>

        <div className="space-y-4">
          <h2 className="font-semibold text-white text-sm">Yetenek Kartları</h2>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="grid grid-cols-2 gap-2">
              <Field label={`Kart ${n} — Başlık`}>
                <TextInput
                  value={String(about[`cap${n}Title`] ?? "")}
                  onChange={(e) => setAbout({ ...about, [`cap${n}Title`]: e.target.value })}
                />
              </Field>
              <Field label={`Kart ${n} — Açıklama`}>
                <TextInput
                  value={String(about[`cap${n}Desc`] ?? "")}
                  onChange={(e) => setAbout({ ...about, [`cap${n}Desc`]: e.target.value })}
                />
              </Field>
            </div>
          ))}

          <h2 className="font-semibold text-white text-sm pt-2">Değerler (foto altındaki 3 satır)</h2>
          <Field label="Değer 1">
            <TextInput value={about.valueShip} onChange={(e) => setAbout({ ...about, valueShip: e.target.value })} />
          </Field>
          <Field label="Değer 2">
            <TextInput value={about.valueCode} onChange={(e) => setAbout({ ...about, valueCode: e.target.value })} />
          </Field>
          <Field label="Değer 3">
            <TextInput value={about.valueDesign} onChange={(e) => setAbout({ ...about, valueDesign: e.target.value })} />
          </Field>
        </div>
      </div>
    </div>
  );
}
