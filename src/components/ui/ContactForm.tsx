"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const inputClass =
  "w-full px-4 py-3 bg-surface-elevated border border-border rounded-xl text-foreground placeholder:text-muted text-sm focus:outline-none focus:border-accent focus:bg-surface transition-all duration-200";

const labelClass = "block text-sm font-medium text-foreground mb-2";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const t = useTranslations("contact.form");

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, t("nameError")),
        email: z.string().email(t("emailError")),
        subject: z.string().min(5, t("subjectError")),
        message: z.string().min(20, t("messageError")),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      reset();
      setTimeout(() => setStatus("idle"), 6000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-name" className={labelClass}>{t("name")}</label>
          <input
            id="contact-name"
            {...register("name")}
            placeholder={t("namePlaceholder")}
            className={inputClass}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
          />
          {errors.name && (
            <p id="contact-name-error" className="mt-1.5 text-xs text-red-400">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClass}>{t("email")}</label>
          <input
            id="contact-email"
            {...register("email")}
            type="email"
            placeholder={t("emailPlaceholder")}
            className={inputClass}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
          />
          {errors.email && (
            <p id="contact-email-error" className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className={labelClass}>{t("subject")}</label>
        <input
          id="contact-subject"
          {...register("subject")}
          placeholder={t("subjectPlaceholder")}
          className={inputClass}
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? "contact-subject-error" : undefined}
        />
        {errors.subject && (
          <p id="contact-subject-error" className="mt-1.5 text-xs text-red-400">{errors.subject.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>{t("message")}</label>
        <textarea
          id="contact-message"
          {...register("message")}
          rows={6}
          placeholder={t("messagePlaceholder")}
          className={`${inputClass} resize-none`}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
        />
        {errors.message && (
          <p id="contact-message-error" className="mt-1.5 text-xs text-red-400">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full flex items-center justify-center gap-2 py-4 bg-accent hover:bg-accent-light text-white font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {status === "loading" ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            {t("sending")}
          </>
        ) : (
          <>
            <Send size={18} />
            {t("send")}
          </>
        )}
      </button>

      {status === "success" && (
        <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm">
          <CheckCircle size={18} className="shrink-0" />
          {t("successMsg")}
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          <AlertCircle size={18} className="shrink-0" />
          {t("errorMsg")}
        </div>
      )}
    </form>
  );
}
