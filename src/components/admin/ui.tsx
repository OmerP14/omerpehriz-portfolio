"use client";

import { useState } from "react";
import { X, Plus, Loader2 } from "lucide-react";

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full px-3 py-2 bg-[#0d0d1a] border border-[#1e1e38] rounded-lg text-white text-sm placeholder-gray-600 outline-none focus:border-indigo-500 transition-colors";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={inputClass + " " + (props.className ?? "")} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={inputClass + " resize-y min-h-[5rem] " + (props.className ?? "")}
    />
  );
}

export function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={inputClass}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-[#1e1e38] bg-[#0d0d1a] accent-indigo-500"
      />
      {label}
    </label>
  );
}

/** Editable list of short strings (technologies, tags, features, ...). */
export function ListEditor({
  items,
  onChange,
  placeholder,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const value = draft.trim();
    if (!value) return;
    onChange([...items, value]);
    setDraft("");
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs text-indigo-300"
          >
            {item}
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="hover:text-red-400"
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <TextInput
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder ?? "Ekle ve Enter'a bas"}
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

export function SaveButton({
  onClick,
  saving,
  label = "Kaydet",
}: {
  onClick: () => void;
  saving: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={saving}
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors"
    >
      {saving && <Loader2 size={15} className="animate-spin" />}
      {label}
    </button>
  );
}

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#0d0d1a] border border-[#1e1e38] rounded-2xl p-6">
      {children}
    </div>
  );
}

export function LocaleTabs({
  locale,
  onChange,
}: {
  locale: "tr" | "en";
  onChange: (l: "tr" | "en") => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 p-1 bg-[#0d0d1a] border border-[#1e1e38] rounded-lg mb-4">
      {(["tr", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => onChange(l)}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase transition-colors ${
            locale === l
              ? "bg-indigo-500 text-white"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
