import { loadPalette, listPalettes } from "@/src/lib/palettes";
import { PaletteProvider } from "@/src/components/shared/PaletteProvider";

export default function TestPalettePage() {
  const palettes = listPalettes();
  const palette = loadPalette("ocean-blue");

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Palette System Test</h1>
      <p>Available palettes: {palettes.map((p) => p.name).join(", ")}</p>

      <PaletteProvider palette={palette}>
        <div
          style={{
            marginTop: "2rem",
            padding: "2rem",
            background: "var(--color-background)",
            color: "var(--color-text-primary)",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
          }}
        >
          <h2 style={{ color: "var(--color-heading)" }}>
            {palette.name} Palette
          </h2>
          <p style={{ color: "var(--color-text-secondary)" }}>
            CSS custom properties are applied via inline styles on the wrapper
            div.
          </p>
          <button
            style={{
              background: "var(--color-primary)",
              color: "var(--color-text-inverted)",
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Primary Button
          </button>
          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              background: "var(--color-surface)",
            }}
          >
            Surface color
          </div>
        </div>
      </PaletteProvider>
    </div>
  );
}
