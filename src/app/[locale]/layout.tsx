import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import "../globals.css";
import { Providers } from "@/components/layout/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { personSchema, websiteSchema } from "@/lib/structured-data";
import { routing } from "@/i18n/routing";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "personal" });

  return {
    metadataBase: new URL("https://omerpehriz.dev"),
    title: {
      default: `Ömer Pehriz | ${t("title")}`,
      template: `%s | Ömer Pehriz`,
    },
    description: t("seoDescription"),
    keywords: [
      "Software Engineer",
      "Yazılım Mühendisi",
      "React Developer",
      "Next.js Developer",
      "TypeScript",
      "Node.js",
      "React Native",
      "SaaS Development",
      "Ömer Pehriz",
      "Software Engineer Turkey",
    ],
    authors: [{ name: "Ömer Pehriz", url: "https://omerpehriz.dev" }],
    creator: "Ömer Pehriz",
    openGraph: {
      type: "website",
      locale: locale === "tr" ? "tr_TR" : "en_US",
      url: "https://omerpehriz.dev",
      title: `Ömer Pehriz | ${t("title")}`,
      description: t("seoDescription"),
      siteName: "Ömer Pehriz",
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: `Ömer Pehriz — ${t("title")}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Ömer Pehriz | ${t("title")}`,
      description: t("seoDescription"),
      creator: "@omerpehriz",
      images: ["/og.png"],
    },
    icons: {
      icon: [
        { url: "/favicon-black-32.png", sizes: "32x32", media: "(prefers-color-scheme: light)" },
        { url: "/favicon-white-32.png", sizes: "32x32", media: "(prefers-color-scheme: dark)" },
      ],
      apple: "/favicon-white-180.png",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: "https://omerpehriz.dev",
      languages: {
        en: "https://omerpehriz.dev/en",
        tr: "https://omerpehriz.dev/tr",
      },
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema()) }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <Navbar />
            <div className="flex flex-col flex-1 overflow-x-hidden">
              <main className="flex-1 w-full">{children}</main>
              <Footer />
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
