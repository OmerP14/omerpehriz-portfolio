"use client";

import { useState } from "react";
import { Lock, Image as ImageIcon, Code2, Palette, Briefcase, UserRound, FileText } from "lucide-react";
import { AdminProvider } from "@/components/admin/AdminContext";
import { ImagesTab } from "@/components/admin/ImagesTab";
import { SoftwareProjectsTab } from "@/components/admin/SoftwareProjectsTab";
import { DesignProjectsTab } from "@/components/admin/DesignProjectsTab";
import { ExperienceTab } from "@/components/admin/ExperienceTab";
import { AboutTab } from "@/components/admin/AboutTab";
import { CvTab } from "@/components/admin/CvTab";

type Tab = "software" | "design" | "experience" | "about" | "cv" | "images";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "software", label: "Yazılım Projeleri", icon: Code2 },
  { id: "design", label: "Tasarım Projeleri", icon: Palette },
  { id: "experience", label: "Deneyim", icon: Briefcase },
  { id: "about", label: "Hakkımda", icon: UserRound },
  { id: "cv", label: "CV", icon: FileText },
  { id: "images", label: "Ekstra Görseller", icon: ImageIcon },
];

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [tab, setTab] = useState<Tab>("software");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/images", {
      headers: { "x-admin-password": password },
    });
    if (res.ok) {
      setAuthed(true);
      setAuthError(false);
    } else {
      setAuthError(true);
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
            {authError && <p className="text-red-400 text-sm text-center">Yanlış şifre</p>}
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
    <AdminProvider password={password}>
      <div className="min-h-screen bg-[#07070f] text-white">
        <div className="border-b border-[#1e1e38] sticky top-0 bg-[#07070f]/95 backdrop-blur-sm z-40">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Lock size={14} className="text-indigo-400" />
              </div>
              <span className="font-semibold text-sm">Admin Panel</span>
            </div>
            <button
              onClick={() => setAuthed(false)}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Çıkış
            </button>
          </div>
          <div className="max-w-5xl mx-auto px-4 pb-3 flex flex-wrap gap-2">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  tab === id
                    ? "bg-indigo-500 text-white"
                    : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                }`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-10">
          {tab === "software" && <SoftwareProjectsTab />}
          {tab === "design" && <DesignProjectsTab />}
          {tab === "experience" && <ExperienceTab />}
          {tab === "about" && <AboutTab />}
          {tab === "cv" && <CvTab />}
          {tab === "images" && <ImagesTab />}
        </div>
      </div>
    </AdminProvider>
  );
}
