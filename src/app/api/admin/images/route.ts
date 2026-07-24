import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { isAuthorized } from "@/lib/admin-auth";

const IMAGE_EXTS = /\.(png|jpg|jpeg|webp)$/i;

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const slug = request.nextUrl.searchParams.get("slug");
  const dir = path.join(process.cwd(), "public/images/projects");

  if (!fs.existsSync(dir)) {
    return NextResponse.json(slug ? { screenshots: [] } : {});
  }

  const files = fs.readdirSync(dir).filter((f) => IMAGE_EXTS.test(f));

  if (slug) {
    const screenshots = files
      .filter((f) => new RegExp(`^${slug}-\\d+\\.`, "i").test(f))
      .sort()
      .map((f) => `/images/projects/${f}`);

    return NextResponse.json({ screenshots });
  }

  // Return every project's screenshots, grouped by slug.
  const grouped: Record<string, { screenshots: string[] }> = {};
  for (const f of files) {
    const match = f.match(/^(.+)-\d+\./);
    if (!match) continue;
    const key = match[1];
    if (!grouped[key]) grouped[key] = { screenshots: [] };
    grouped[key].screenshots.push(`/images/projects/${f}`);
  }
  for (const key of Object.keys(grouped)) {
    grouped[key].screenshots.sort();
  }

  return NextResponse.json(grouped);
}
