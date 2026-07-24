"use client";

import { useRef, useState } from "react";
import { FileText, Upload, Loader2, ExternalLink } from "lucide-react";
import { useAdmin } from "./AdminContext";

export function CvTab() {
  const { password, addToast } = useAdmin();
  const [uploading, setUploading] = useState(false);
  const [version, setVersion] = useState(() => Date.now());
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    if (file.type !== "application/pdf") {
      addToast("error", "CV dosyası PDF olmalı");
      return;
    }
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("type", "cv");
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "x-admin-password": password },
        body,
      });
      if (res.ok) {
        setVersion(Date.now());
        addToast("success", "CV güncellendi");
      } else {
        addToast("error", "Yükleme başarısız");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">CV</h1>
        <p className="text-gray-500 text-sm mt-1">
          &ldquo;Hakkımda&rdquo; bölümündeki CV indirme bağlantısı için kullanılan dosya.
        </p>
      </div>

      <div className="bg-[#0d0d1a] border border-[#1e1e38] rounded-2xl p-6 max-w-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <FileText size={18} className="text-indigo-400" />
          </div>
          <div>
            <p className="font-medium text-white text-sm">cv.pdf</p>
            <a
              href={`/cv.pdf?v=${version}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
            >
              Mevcut dosyayı görüntüle
              <ExternalLink size={11} />
            </a>
          </div>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-xl text-indigo-400 text-sm transition-colors disabled:opacity-50"
        >
          {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
          Yeni CV yükle (PDF)
        </button>
      </div>
    </div>
  );
}
