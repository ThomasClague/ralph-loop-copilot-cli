import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { createMedia, getBatch } from "@/src/db/repository";

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
const FILENAME_REGEX =
  /^(hero|gallery|about|services|team)-(\w+)-([a-z0-9-]+)\.(jpg|jpeg|png|webp)$/i;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * POST /api/batches/[id]/media
 * Accepts multipart file upload, validates filename convention, saves to disk,
 * creates a media record in the database.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: batchId } = await params;

  const batch = await getBatch(batchId);
  if (!batch) {
    return NextResponse.json({ error: "Batch not found" }, { status: 404 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid multipart form data" },
      { status: 400 },
    );
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: 'No file provided. Use field name "file".' },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File too large. Maximum size is 10MB." },
      { status: 413 },
    );
  }

  const filename = file.name;
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";

  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return NextResponse.json(
      {
        error: `Invalid file type. Allowed types: ${ALLOWED_EXTENSIONS.join(", ")}`,
      },
      { status: 400 },
    );
  }

  const match = FILENAME_REGEX.exec(filename);
  if (!match) {
    return NextResponse.json(
      {
        error:
          "Invalid filename. Expected format: {slot}-{industry}-{descriptor}.{ext}. " +
          "Valid slots: hero, gallery, about, services, team. " +
          "Valid extensions: jpg, jpeg, png, webp. " +
          "Example: hero-roofing-tiles.jpg",
      },
      { status: 400 },
    );
  }

  const slot = match[1].toLowerCase();
  const industry = match[2].toLowerCase();

  const uploadDir = path.join(process.cwd(), "uploads", batchId);
  fs.mkdirSync(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  // Store path relative to project root for portability
  const relativePath = path.join("uploads", batchId, filename);

  const record = await createMedia({
    id: randomUUID(),
    batchId,
    filename,
    slot,
    industry,
    path: relativePath,
    createdAt: Date.now(),
  });

  return NextResponse.json(record, { status: 201 });
}
