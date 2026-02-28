"use client";

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageIcon, UploadCloud, X } from "lucide-react";

// Mirror the regex from /api/batches/[id]/media
const FILENAME_REGEX =
  /^(hero|gallery|about|services|team)-(\w+)-([a-z0-9-]+)\.(jpg|jpeg|png|webp)$/i;

interface MediaFile {
  file: File;
  slot: string | null;
  industry: string | null;
  descriptor: string | null;
  valid: boolean;
  error: string | null;
  status: "pending" | "uploading" | "uploaded" | "upload-error";
  uploadError: string | null;
}

export interface MediaUploadAreaRef {
  /** Upload all valid files to the given batch. Resolves when all uploads finish. */
  uploadFiles: (batchId: string) => Promise<void>;
  /** True if there is at least one valid file ready to upload. */
  hasFiles: () => boolean;
}

function parseMediaFile(file: File): MediaFile {
  const match = FILENAME_REGEX.exec(file.name);
  if (!match) {
    return {
      file,
      slot: null,
      industry: null,
      descriptor: null,
      valid: false,
      error:
        "Invalid filename. Use: {slot}-{industry}-{descriptor}.jpg (e.g. hero-roofing-tiles.jpg)",
      status: "pending",
      uploadError: null,
    };
  }
  return {
    file,
    slot: match[1].toLowerCase(),
    industry: match[2].toLowerCase(),
    descriptor: match[3].toLowerCase(),
    valid: true,
    error: null,
    status: "pending",
    uploadError: null,
  };
}

/**
 * Drag-and-drop media upload area with filename validation.
 * Exposes an `uploadFiles(batchId)` method via ref.
 */
export const MediaUploadArea = forwardRef<MediaUploadAreaRef>(
  function MediaUploadArea(_, ref) {
    const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    /** Add new files, skipping duplicates */
    const addFiles = useCallback((incoming: File[]) => {
      setMediaFiles((prev) => {
        const existing = new Set(prev.map((f) => f.file.name));
        const fresh = incoming
          .filter((f) => !existing.has(f.name))
          .map(parseMediaFile);
        return [...prev, ...fresh];
      });
    }, []);

    useImperativeHandle(ref, () => ({
      uploadFiles: async (batchId: string) => {
        const valid = mediaFiles.filter((mf) => mf.valid);
        for (const mf of valid) {
          setMediaFiles((prev) =>
            prev.map((f) =>
              f.file.name === mf.file.name ? { ...f, status: "uploading" } : f,
            ),
          );

          const form = new FormData();
          form.append("file", mf.file);

          try {
            const res = await fetch(`/api/batches/${batchId}/media`, {
              method: "POST",
              body: form,
            });
            if (!res.ok) {
              const data = await res.json().catch(() => ({}));
              setMediaFiles((prev) =>
                prev.map((f) =>
                  f.file.name === mf.file.name
                    ? {
                        ...f,
                        status: "upload-error",
                        uploadError: data.error ?? "Upload failed",
                      }
                    : f,
                ),
              );
            } else {
              setMediaFiles((prev) =>
                prev.map((f) =>
                  f.file.name === mf.file.name
                    ? { ...f, status: "uploaded" }
                    : f,
                ),
              );
            }
          } catch {
            setMediaFiles((prev) =>
              prev.map((f) =>
                f.file.name === mf.file.name
                  ? {
                      ...f,
                      status: "upload-error",
                      uploadError: "Network error",
                    }
                  : f,
              ),
            );
          }
        }
      },
      hasFiles: () => mediaFiles.some((f) => f.valid),
    }));

    /* ---- Drag-and-drop handlers ---- */
    function handleDragOver(e: React.DragEvent) {
      e.preventDefault();
      setDragging(true);
    }
    function handleDragLeave() {
      setDragging(false);
    }
    function handleDrop(e: React.DragEvent) {
      e.preventDefault();
      setDragging(false);
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith("image/"),
      );
      addFiles(files);
    }
    function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
      const files = Array.from(e.target.files ?? []);
      addFiles(files);
      // Reset input so same file can be re-added after removal
      if (inputRef.current) inputRef.current.value = "";
    }
    function removeFile(name: string) {
      setMediaFiles((prev) => prev.filter((f) => f.file.name !== name));
    }

    const validCount = mediaFiles.filter((f) => f.valid).length;

    return (
      <div className="space-y-3">
        {/* Instruction */}
        <p className="text-sm text-muted-foreground">
          Name files as:{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            &#123;slot&#125;-&#123;industry&#125;-&#123;descriptor&#125;.jpg
          </code>{" "}
          — Valid slots:{" "}
          <span className="font-medium">
            hero, gallery, about, services, team
          </span>
          . Examples:{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            hero-roofing-tiles.jpg
          </code>
          ,{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            gallery-plumbing-pipes.png
          </code>
        </p>

        {/* Dropzone */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={[
            "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition-colors",
            dragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/30",
          ].join(" ")}
        >
          <UploadCloud className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drag &amp; drop images here, or{" "}
            <span className="text-primary underline-offset-2 hover:underline">
              click to select
            </span>
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileInput}
          />
        </div>

        {/* File list */}
        {mediaFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              {validCount} valid file{validCount !== 1 ? "s" : ""} /{" "}
              {mediaFiles.length} total
            </p>
            <ul className="space-y-1.5">
              {mediaFiles.map((mf) => (
                <li
                  key={mf.file.name}
                  className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
                >
                  <ImageIcon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <span className="flex-1 truncate font-mono text-xs">
                    {mf.file.name}
                  </span>

                  {mf.valid ? (
                    <>
                      <Badge variant="secondary" className="capitalize text-xs">
                        {mf.slot}
                      </Badge>
                      <Badge variant="outline" className="capitalize text-xs">
                        {mf.industry}
                      </Badge>
                      {mf.status === "pending" && (
                        <Badge
                          variant="outline"
                          className="text-xs text-green-700 border-green-400"
                        >
                          ready
                        </Badge>
                      )}
                      {mf.status === "uploading" && (
                        <Badge
                          variant="outline"
                          className="text-xs text-blue-700 border-blue-400"
                        >
                          uploading…
                        </Badge>
                      )}
                      {mf.status === "uploaded" && (
                        <Badge
                          variant="outline"
                          className="text-xs text-green-700 border-green-500"
                        >
                          ✓ uploaded
                        </Badge>
                      )}
                      {mf.status === "upload-error" && (
                        <Badge
                          variant="outline"
                          className="text-xs text-destructive border-destructive"
                          title={mf.uploadError ?? undefined}
                        >
                          error
                        </Badge>
                      )}
                    </>
                  ) : (
                    <span className="text-xs text-destructive">{mf.error}</span>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 flex-shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(mf.file.name);
                    }}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  },
);
