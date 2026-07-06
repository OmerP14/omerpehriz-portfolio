import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

const IMAGE_EXTS = /\.(png|jpg|jpeg|webp)$/i;

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  const dir = path.join(process.cwd(), "public/images/projects");

  if (!fs.existsSync(dir)) {
    return NextResponse.json({ main: null, screenshots: [] });
  }

  const files = fs.readdirSync(dir).filter((f) => IMAGE_EXTS.test(f));

  if (slug) {
    const main = files.find((f) => new RegExp(`^${slug}\\.`, "i").test(f));
    const screenshots = files
      .filter((f) => new RegExp(`^${slug}-\\d+\\.`, "i").test(f))
      .sort()
      .map((f) => `/images/projects/${f}`);

    return NextResponse.json({
      main: main ? `/images/projects/${main}` : null,
      screenshots,
    });
  }

  // Return all projects grouped by slug
  const grouped: Record<string, { main: string | null; screenshots: string[] }> = {};
  for (const f of files) {
    const screenshotMatch = f.match(/^(.+)-\d+\./);
    const mainMatch = !screenshotMatch && f.match(/^([^-]+)\./);
    const key = screenshotMatch?.[1] ?? mainMatch?.[1];
    if (!key) continue;
    if (!grouped[key]) grouped[key] = { main: null, screenshots: [] };
    if (screenshotMatch) {
      grouped[key].screenshots.push(`/images/projects/${f}`);
    } else {
      grouped[key].main = `/images/projects/${f}`;
    }
  }
  for (const key of Object.keys(grouped)) {
    grouped[key].screenshots.sort();
  }

  return NextResponse.json(grouped);
}
