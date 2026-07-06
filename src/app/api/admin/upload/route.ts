import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "omer2024";

export async function POST(request: NextRequest) {
  if (request.headers.get("x-admin-password") !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const slug = formData.get("slug") as string | null;
  const type = (formData.get("type") as string) ?? "main";

  if (!file || !slug) {
    return NextResponse.json({ error: "Missing file or slug" }, { status: 400 });
  }

  const ext = (file.name.split(".").pop() ?? "png").toLowerCase();
  const dir = path.join(process.cwd(), "public/images/projects");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  let filename: string;

  if (type === "main") {
    // Remove existing main images for this slug
    fs.readdirSync(dir)
      .filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f) && f.match(new RegExp(`^${slug}\\.(png|jpg|jpeg|webp)$`, "i")))
      .forEach((f) => fs.unlinkSync(path.join(dir, f)));
    filename = `${slug}.${ext}`;
  } else {
    const existing = fs.readdirSync(dir).filter((f) =>
      new RegExp(`^${slug}-\\d+\\.`, "i").test(f)
    );
    filename = `${slug}-${existing.length + 1}.${ext}`;
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(dir, filename), buffer);

  return NextResponse.json({ success: true, path: `/images/projects/${filename}` });
}

export async function DELETE(request: NextRequest) {
  if (request.headers.get("x-admin-password") !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { filename } = await request.json();
  if (!filename) return NextResponse.json({ error: "Missing filename" }, { status: 400 });

  const filepath = path.join(process.cwd(), "public", filename);
  if (fs.existsSync(filepath)) fs.unlinkSync(filepath);

  return NextResponse.json({ success: true });
}
