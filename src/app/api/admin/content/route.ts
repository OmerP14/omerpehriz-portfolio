import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { isAuthorized } from "@/lib/admin-auth";

const ROOT = process.cwd();
const PROJECTS_JSON = path.join(ROOT, "src/content/data/projects.json");
const EXPERIENCE_JSON = path.join(ROOT, "src/content/data/experience.json");
const MESSAGES = {
  tr: path.join(ROOT, "messages/tr.json"),
  en: path.join(ROOT, "messages/en.json"),
} as const;

type Locale = keyof typeof MESSAGES;

function readJson(file: string) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file: string, data: unknown) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
}

/**
 * Replaces each top-level namespace named in `patch` wholesale (e.g. `projects`, `about`).
 * The caller is expected to send the complete subtree for any namespace it owns — read the
 * current bundle via GET, edit in memory, send the whole namespace back — so that removed
 * keys (a deleted project's translations, say) actually disappear instead of lingering.
 */
function replaceNamespaces(target: Record<string, unknown>, patch: Record<string, unknown>) {
  for (const key of Object.keys(patch)) {
    target[key] = patch[key];
  }
  return target;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    projects: readJson(PROJECTS_JSON),
    experience: readJson(EXPERIENCE_JSON),
    messages: {
      tr: readJson(MESSAGES.tr),
      en: readJson(MESSAGES.en),
    },
  });
}

type Body =
  | { target: "software-projects"; data: unknown[] }
  | { target: "design-projects"; data: unknown[] }
  | { target: "experience"; data: { work: unknown[]; education: unknown[] } }
  | { target: "messages"; locale: Locale; patch: Record<string, unknown> };

export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Body;

  switch (body.target) {
    case "software-projects": {
      const current = readJson(PROJECTS_JSON);
      current.software = body.data;
      writeJson(PROJECTS_JSON, current);
      return NextResponse.json({ success: true });
    }
    case "design-projects": {
      const current = readJson(PROJECTS_JSON);
      current.design = body.data;
      writeJson(PROJECTS_JSON, current);
      return NextResponse.json({ success: true });
    }
    case "experience": {
      writeJson(EXPERIENCE_JSON, body.data);
      return NextResponse.json({ success: true });
    }
    case "messages": {
      if (!MESSAGES[body.locale]) {
        return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
      }
      const file = MESSAGES[body.locale];
      const current = readJson(file);
      replaceNamespaces(current, body.patch);
      writeJson(file, current);
      return NextResponse.json({ success: true });
    }
    default:
      return NextResponse.json({ error: "Unknown target" }, { status: 400 });
  }
}
