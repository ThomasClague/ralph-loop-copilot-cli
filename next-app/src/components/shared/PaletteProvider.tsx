"use client";

import React from "react";
import type { Palette } from "@/src/lib/palettes";

interface PaletteProviderProps {
  palette: Palette;
  children: React.ReactNode;
}

/**
 * Wraps a site render and injects palette CSS custom properties as inline styles.
 * Switching the `palette` prop re-renders and updates all CSS vars instantly.
 */
export function PaletteProvider({ palette, children }: PaletteProviderProps) {
  return <div style={palette.tokens as React.CSSProperties}>{children}</div>;
}
