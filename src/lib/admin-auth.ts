import type { NextRequest } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "omer2024";

export function isAuthorized(request: NextRequest): boolean {
  return request.headers.get("x-admin-password") === ADMIN_PASSWORD;
}
