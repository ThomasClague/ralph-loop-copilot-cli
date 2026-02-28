import { NextResponse } from "next/server";
import { listPalettes } from "@/src/lib/palettes";

/** GET /api/palettes — returns all available palette metadata and tokens */
export async function GET() {
  const palettes = listPalettes();
  return NextResponse.json(palettes);
}
