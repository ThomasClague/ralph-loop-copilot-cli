import { NextRequest, NextResponse } from "next/server";

const SIDECAR_URL = "http://localhost:3001/api/crawl";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { url } = body as { url?: string };
  if (!url || !url.trim()) {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }

  try {
    const sidecarRes = await fetch(SIDECAR_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const data = await sidecarRes.json();
    return NextResponse.json(data, { status: sidecarRes.status });
  } catch {
    return NextResponse.json(
      { error: "Crawl service unavailable. Make sure the sidecar is running." },
      { status: 503 },
    );
  }
}
