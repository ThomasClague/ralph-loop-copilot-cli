import { NextRequest, NextResponse } from "next/server";
import { getAllSettings, setSetting } from "@/src/db/repository";

const SENSITIVE_KEYS = [
  "anthropic_api_key",
  "pexels_api_key",
  "resend_api_key",
];

function maskSettings(raw: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(raw).map(([k, v]) => [
      k,
      SENSITIVE_KEYS.includes(k) && v.length > 4 ? `****${v.slice(-4)}` : v,
    ]),
  );
}

export async function GET() {
  try {
    const data = await getAllSettings();
    return NextResponse.json(maskSettings(data));
  } catch (err) {
    console.error("[GET /api/settings]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, string>;

    for (const [key, value] of Object.entries(body)) {
      if (typeof key === "string" && typeof value === "string") {
        await setSetting(key, value);
      }
    }

    const updated = await getAllSettings();
    return NextResponse.json(maskSettings(updated));
  } catch (err) {
    console.error("[PUT /api/settings]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
