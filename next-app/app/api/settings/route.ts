import { NextRequest, NextResponse } from "next/server";
import { getAllSettings, setSetting } from "@/src/db/repository";

export async function GET() {
  try {
    const data = await getAllSettings();
    return NextResponse.json(data);
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

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[PUT /api/settings]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
