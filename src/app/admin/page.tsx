"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Upload, Trash2, Lock, Image as ImageIcon, Plus, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { softwareProjects } from "@/content/projects";

type ProjectImages = { main: string | null; screenshots: string[] };
type AllImages = Record<string, ProjectImages>;
type Toast = { id: number; type: "success" | "error"; msg: string };

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [images, setImages] = useState<AllImages>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  const addToast = (type: "success" | "error", msg: string) => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { id, type, msg }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  const fetchImages = useCallback(async (pass: string) => {
    const res = await fetch("/api/admin/images", {
      headers: { "x-admin-password": pass },
    });
    if (res.ok) setImages(await res.json());
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/images", {
      headers: { "x-admin-password": password },
    });
    if (res.ok) {
      setAuthed(true);
      setAuthError(false);
      setImages(await res.json());
    } else {
      setAuthError(true);
    }
  };

  const upload = async (
    slug: string,
    file: File,
    type: "main" | "screenshot"
  ) => {
    const key = `${slug}-${type}`;
    setUploading((prev) => ({ ...prev, [key]: true }));
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("slug", slug);
      body.append("type", type);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "x-admin-password": password },
        body,
      });
      if (res.ok) {
        addToast("success", type === "main" ? "Ana görsel yüklendi" : "Ekran görüntüsü eklendi");
        await fetchImages(password);
      } else {
        addToast("error", "Yükleme başarısız");
      }
    } finally {
      setUploading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const deleteImage = async (slug: string, filename: string) => {
    const res = await fetch("/api/admin/upload", {
      method: "DELETE",
      headers: { "x-admin-password": password, "content-type": "application/json" },
      body: JSON.stringify({ filename }),
    });
    if (res.ok) {
      addToast("success", "Görsel silindi");
      await fetchImages(password);
    } else {
      addToast("error", "Silme başarısız");
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#07070f] flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Lock size={18} className="text-indigo-400" />
            </div>
            <h1 className="text-white font-bold text-xl">Admin Panel</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              className={`w-full px-4 py-3 bg-[#0d0d1a] border rounded-xl text-white placeholder-gray-500 outline-none focus:border-indigo-500 transition-colors ${
                authError ? "border-red-500" : "border-[#1e1e38]"
              }`}
            />
            {authError && (
              <p className="text-red-400 text-sm text-center">Yanlış şifre</p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-xl transition-colors"
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07070f] text-white">
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
              t.type === "success"
                ? "bg-green-500/10 border border-green-500/30 text-green-400"
                : "bg-red-500/10 border border-red-500/30 text-red-400"
            }`}
          >
            {t.type === "success" ? <CheckCircle size={16} /> : <XCircle size={16} />}
            {t.msg}
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold">Proje Görselleri</h1>
            <p className="text-gray-500 text-sm mt-1">
              Ana görsel kart ve detay sayfası için, ekran görüntüleri detay sayfasında gösterilir
            </p>
          </div>
          <button
            onClick={() => setAuthed(false)}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Çıkış
          </button>
        </div>

        <div className="space-y-6">
          {softwareProjects.map((project) => {
            const imgs = images[project.slug] ?? { main: null, screenshots: [] };
            const mainKey = `${project.slug}-main`;
            const ssKey = `${project.slug}-screenshot`;

            return (
              <div
                key={project.slug}
                className="bg-[#0d0d1a] border border-[#1e1e38] rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                    {project.category}
                  </span>
                  <h2 className="font-semibold text-white">{project.slug}</h2>
                  <span className="text-gray-600 text-xs">{project.year}</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Main image */}
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                      Ana Görsel (Kart + Hero)
                    </p>
                    {imgs.main ? (
                      <div className="relative rounded-xl overflow-hidden aspect-video border border-[#1e1e38] group">
                        <Image src={imgs.main} alt="main" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <UploadButton
                            label="Değiştir"
                            icon={<Upload size={14} />}
                            loading={!!uploading[mainKey]}
                            onFile={(f) => upload(project.slug, f, "main")}
                            small
                          />
                          <button
                            onClick={() => deleteImage(project.slug, imgs.main!)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 rounded-lg text-red-400 text-xs transition-colors"
                          >
                            <Trash2 size={14} />
                            Sil
                          </button>
                        </div>
                      </div>
                    ) : (
                      <UploadButton
                        label="Ana görsel yükle"
                        icon={<ImageIcon size={16} />}
                        loading={!!uploading[mainKey]}
                        onFile={(f) => upload(project.slug, f, "main")}
                        full
                      />
                    )}
                  </div>

                  {/* Screenshots */}
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                      Ekran Görüntüleri ({imgs.screenshots.length})
                    </p>
                    <div className="space-y-2">
                      {imgs.screenshots.map((src) => (
                        <div
                          key={src}
                          className="relative rounded-xl overflow-hidden aspect-video border border-[#1e1e38] group"
                        >
                          <Image src={src} alt="screenshot" fill className="object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              onClick={() => deleteImage(project.slug, src)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 rounded-lg text-red-400 text-xs transition-colors"
                            >
                              <Trash2 size={14} />
                              Sil
                            </button>
                          </div>
                        </div>
                      ))}
                      <UploadButton
                        label="Ekran görüntüsü ekle"
                        icon={<Plus size={14} />}
                        loading={!!uploading[ssKey]}
                        onFile={(f) => upload(project.slug, f, "screenshot")}
                        small={imgs.screenshots.length > 0}
                        full={imgs.screenshots.length === 0}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function UploadButton({
  label,
  icon,
  loading,
  onFile,
  small,
  full,
}: {
  label: string;
  icon: React.ReactNode;
  loading: boolean;
  onFile: (f: File) => void;
  small?: boolean;
  full?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);

  if (full) {
    return (
      <>
        <input
          ref={ref}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
        />
        <button
          onClick={() => ref.current?.click()}
          disabled={loading}
          className="w-full aspect-video border-2 border-dashed border-[#1e1e38] hover:border-indigo-500/50 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-indigo-400 transition-colors"
        >
          {loading ? (
            <Loader2 size={24} className="animate-spin text-indigo-400" />
          ) : (
            <>
              {icon}
              <span className="text-xs">{label}</span>
            </>
          )}
        </button>
      </>
    );
  }

  return (
    <>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />
      <button
        onClick={() => ref.current?.click()}
        disabled={loading}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 hover:border-indigo-500/40 rounded-lg text-indigo-400 text-xs transition-colors"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : icon}
        {label}
      </button>
    </>
  );
}
