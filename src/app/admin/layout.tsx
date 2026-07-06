import "../globals.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="bg-[#07070f] text-white">{children}</body>
    </html>
  );
}
