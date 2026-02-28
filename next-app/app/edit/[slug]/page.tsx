"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteRenderer } from "@/src/components/shared/SectionRenderer";
import { PaletteProvider } from "@/src/components/shared/PaletteProvider";
import { SectionListPanel } from "@/components/edit/SectionListPanel";
import { PalettePicker } from "@/components/edit/PalettePicker";
import { ContentEditorDrawer } from "@/components/edit/ContentEditorDrawer";
import { BusinessInfoEditor } from "@/components/edit/BusinessInfoEditor";
import { ExportButton } from "@/components/edit/ExportButton";
import type { SiteConfig, SiteSection, BusinessInfo } from "@/src/types/site";
import type { Palette } from "@/src/lib/palettes";

type SaveState = "idle" | "saving" | "saved" | "error";

export default function EditPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const router = useRouter();

  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [activePalette, setActivePalette] = useState<Palette | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [batchId, setBatchId] = useState<string | null>(null);
  const [prospectId, setProspectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstMount = useRef(true);

  // Fetch prospect + palettes on mount
  useEffect(() => {
    async function load() {
      try {
        const [prospectRes, palettesRes] = await Promise.all([
          fetch(`/api/prospects/${slug}`),
          fetch("/api/palettes"),
        ]);
        if (!prospectRes.ok) {
          setError("Prospect not found");
          setLoading(false);
          return;
        }
        const prospect = await prospectRes.json();
        const palettesData: Palette[] = await palettesRes.json();

        setBatchId(prospect.batchId);
        setProspectId(prospect.id);
        setPalettes(palettesData);

        if (!prospect.siteConfig) {
          setError(
            "This prospect has no generated site yet. Run generation first.",
          );
          setLoading(false);
          return;
        }

        const config =
          typeof prospect.siteConfig === "string"
            ? (JSON.parse(prospect.siteConfig) as SiteConfig)
            : (prospect.siteConfig as SiteConfig);

        setSiteConfig(config);

        const currentPalette =
          palettesData.find((p) => p.id === config.paletteId) ??
          palettesData[0] ??
          null;
        setActivePalette(currentPalette);
      } catch {
        setError("Failed to load page data");
      } finally {
        setLoading(false);
        isFirstMount.current = false;
      }
    }
    load();
  }, [slug]);

  /** Persist updated siteConfig to server via PATCH */
  const save = useCallback(
    async (config: SiteConfig) => {
      setSaveState("saving");
      try {
        const res = await fetch(`/api/prospects/${slug}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ siteConfig: config }),
        });
        setSaveState(res.ok ? "saved" : "error");
        // Reset back to idle after 2 s
        setTimeout(() => setSaveState("idle"), 2000);
      } catch {
        setSaveState("error");
        setTimeout(() => setSaveState("idle"), 2000);
      }
    },
    [slug],
  );

  /** Schedule auto-save 1500ms after a config change */
  const scheduleSave = useCallback(
    (config: SiteConfig) => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(() => save(config), 1500);
    },
    [save],
  );

  function updateConfig(updated: SiteConfig) {
    setSiteConfig(updated);
    scheduleSave(updated);
  }

  function handlePaletteChange(paletteId: string) {
    const palette = palettes.find((p) => p.id === paletteId) ?? null;
    setActivePalette(palette);
    if (!siteConfig) return;
    const updated: SiteConfig = { ...siteConfig, paletteId };
    updateConfig(updated);
  }

  function handleSectionsChange(sections: SiteSection[]) {
    if (!siteConfig) return;
    updateConfig({ ...siteConfig, sections });
  }

  function handleBusinessInfoChange(businessInfo: BusinessInfo) {
    if (!siteConfig) return;
    updateConfig({ ...siteConfig, businessInfo });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (error || !siteConfig) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-muted-foreground">{error ?? "No data"}</p>
        <Button variant="outline" onClick={() => router.back()}>
          Go back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ── Left panel ─────────────────────────────────────── */}
      <aside className="w-[340px] shrink-0 flex flex-col border-r overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b">
          {batchId && (
            <Button variant="ghost" size="sm" asChild className="p-0 h-auto">
              <Link href={`/batches/${batchId}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          )}
          <h1 className="text-sm font-semibold truncate flex-1">
            {siteConfig.businessInfo.name}
          </h1>
          <SaveIndicator state={saveState} />
        </div>

        {/* Controls stack */}
        <div className="flex flex-col gap-3 p-4 flex-1">
          <BusinessInfoEditor
            businessInfo={siteConfig.businessInfo}
            onChange={handleBusinessInfoChange}
          />

          <PalettePicker
            palettes={palettes}
            selectedId={siteConfig.paletteId}
            onSelect={handlePaletteChange}
          />

          <SectionListPanel
            sections={siteConfig.sections}
            onChange={handleSectionsChange}
          />

          <ContentEditorDrawer
            sections={siteConfig.sections}
            onChange={handleSectionsChange}
          />

          {prospectId && <ExportButton prospectId={prospectId} />}
        </div>
      </aside>

      {/* ── Right panel — live preview ──────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        {activePalette ? (
          <PaletteProvider palette={activePalette}>
            <SiteRenderer config={siteConfig} />
          </PaletteProvider>
        ) : (
          <SiteRenderer config={siteConfig} />
        )}
      </main>
    </div>
  );
}

/** Small save-state indicator rendered in the top bar. */
function SaveIndicator({ state }: { state: SaveState }) {
  if (state === "idle") return null;
  if (state === "saving")
    return <span className="text-xs text-muted-foreground">Saving…</span>;
  if (state === "saved")
    return (
      <span className="text-xs text-green-600 flex items-center gap-0.5">
        <Check className="h-3 w-3" /> Saved
      </span>
    );
  return <span className="text-xs text-destructive">Save failed</span>;
}
