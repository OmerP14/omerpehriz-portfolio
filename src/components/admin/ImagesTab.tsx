"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { useAdmin } from "./AdminContext";
import type { SoftwareProjectData } from "@/content/projects";

type AllImages = Record<string, { screenshots: string[] }>;

export function ImagesTab() {
  const { api, password, addToast } = useAdmin();
  const [projects, setProjects] = useState<SoftwareProjectData[]>([]);
  const [images, setImages] = useState<AllImages>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  const fetchImages = async () => {
    const res = await fetch("/api/admin/images", {
      headers: { "x-admin-password": password },
    });
    if (res.ok) setImages(await res.json());
  };

  useEffect(() => {
    fetchImages();
    (async () => {
      try {
        const res = (await api("/api/admin/content")) as { projects: { software: SoftwareProjectData[] } };
        setProjects(res.projects.software);
      } catch {
        addToast("error", "Proje listesi yüklenemedi");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const upload = async (slug: string, file: File) => {
    setUploading((prev) => ({ ...prev, [slug]: true }));
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("slug", slug);
      body.append("type", "screenshot");
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "x-admin-password": password },
        body,
      });
      if (res.ok) {
        addToast("success", "Ekran görüntüsü eklendi");
        await fetchImages();
      } else {
        addToast("error", "Yükleme başarısız");
      }
    } finally {
      setUploading((prev) => ({ ...prev, [slug]: false }));
    }
  };

  const deleteImage = async (filename: string) => {
    const res = await fetch("/api/admin/upload", {
      method: "DELETE",
      headers: { "x-admin-password": password, "content-type": "application/json" },
      body: JSON.stringify({ filename }),
    });
    if (res.ok) {
      addToast("success", "Görsel silindi");
      await fetchImages();
    } else {
      addToast("error", "Silme başarısız");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Ekstra Görseller</h1>
        <p className="text-gray-500 text-sm mt-1">
          Detay sayfasındaki ek galeri görselleri. Kartlarda/hero&apos;da görünen{" "}
          <strong className="text-gray-300">ana görseli</strong> değiştirmek için{" "}
          <strong className="text-gray-300">Yazılım Projeleri</strong> sekmesindeki
          &ldquo;Ana görseli değiştir&rdquo; butonunu kullan.
        </p>
      </div>

      <div className="space-y-6">
        {projects.map((project) => {
          const imgs = images[project.slug] ?? { screenshots: [] };

          return (
            <div key={project.slug} className="bg-[#0d0d1a] border border-[#1e1e38] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  {project.category}
                </span>
                <h2 className="font-semibold text-white">{project.slug}</h2>
                <span className="text-gray-600 text-xs">
                  Ekran görüntüleri ({imgs.screenshots.length})
                </span>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                {imgs.screenshots.map((src) => (
                  <div
                    key={src}
                    className="relative rounded-xl overflow-hidden aspect-video border border-[#1e1e38] group"
                  >
                    <Image src={src} alt="screenshot" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => deleteImage(src)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 rounded-lg text-red-400 text-xs transition-colors"
                      >
                        <Trash2 size={14} />
                        Sil
                      </button>
                    </div>
                  </div>
                ))}
                <UploadTile
                  loading={!!uploading[project.slug]}
                  onFile={(f) => upload(project.slug, f)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UploadTile({ loading, onFile }: { loading: boolean; onFile: (f: File) => void }) {
  const ref = useRef<HTMLInputElement>(null);

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
        className="aspect-video border-2 border-dashed border-[#1e1e38] hover:border-indigo-500/50 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-indigo-400 transition-colors"
      >
        {loading ? <Loader2 size={20} className="animate-spin text-indigo-400" /> : <Plus size={20} />}
        <span className="text-xs">Ekle</span>
      </button>
    </>
  );
}
