import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { isAuthorized } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const slug = formData.get("slug") as string | null;
  const type = (formData.get("type") as string) ?? "main";

  if (!file) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const ext = (file.name.split(".").pop() ?? "png").toLowerCase();
  const buffer = Buffer.from(await file.arrayBuffer());

  // Site-wide singletons: profile photo and CV, always overwritten in place.
  if (type === "avatar") {
    const dir = path.join(process.cwd(), "public/images/profile");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "avatar.jpg"), buffer);
    return NextResponse.json({ success: true, path: "/images/profile/avatar.jpg" });
  }

  if (type === "cv") {
    if (ext !== "pdf") {
      return NextResponse.json({ error: "CV must be a PDF file" }, { status: 400 });
    }
    fs.writeFileSync(path.join(process.cwd(), "public/cv.pdf"), buffer);
    return NextResponse.json({ success: true, path: "/cv.pdf" });
  }

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  // Main card/hero image — this is the exact file the site renders (content/data/projects.json's
  // `image` field points here), so we write it in place and keep that field in sync.
  if (type === "main") {
    const dir = path.join(process.cwd(), "public/projects");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.readdirSync(dir)
      .filter((f) => new RegExp(`^${slug}\\.(png|jpg|jpeg|webp)$`, "i").test(f))
      .forEach((f) => fs.unlinkSync(path.join(dir, f)));

    const filename = `${slug}.${ext}`;
    fs.writeFileSync(path.join(dir, filename), buffer);
    const newPath = `/projects/${filename}`;

    const projectsFile = path.join(process.cwd(), "src/content/data/projects.json");
    const projectsData = JSON.parse(fs.readFileSync(projectsFile, "utf8"));
    const project = projectsData.software.find((p: { slug: string }) => p.slug === slug);
    if (project) {
      project.image = newPath;
      fs.writeFileSync(projectsFile, JSON.stringify(projectsData, null, 2) + "\n", "utf8");
    }

    return NextResponse.json({ success: true, path: newPath });
  }

  // Extra gallery screenshots, keyed by slug.
  const dir = path.join(process.cwd(), "public/images/projects");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const existing = fs.readdirSync(dir).filter((f) => new RegExp(`^${slug}-\\d+\\.`, "i").test(f));
  const filename = `${slug}-${existing.length + 1}.${ext}`;
  fs.writeFileSync(path.join(dir, filename), buffer);

  return NextResponse.json({ success: true, path: `/images/projects/${filename}` });
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { filename } = await request.json();
  if (!filename) return NextResponse.json({ error: "Missing filename" }, { status: 400 });

  const filepath = path.join(process.cwd(), "public", filename);
  if (fs.existsSync(filepath)) fs.unlinkSync(filepath);

  return NextResponse.json({ success: true });
}
