import { describe, expect, it } from "vitest";
import { extractBranding } from "../../src/scraper/branding";

const BASE_URL = "https://example.com";

describe("extractBranding", () => {
  it("extracts hex colors from CSS", () => {
    const html = `<html><head><style>a { color: #2563eb; background: #10b981; }</style></head><body></body></html>`;
    const result = extractBranding(html, BASE_URL);
    expect(result.colors).toContain("#2563eb");
    expect(result.colors).toContain("#10b981");
  });

  it("converts 3-char hex to 6-char", () => {
    const html = `<html><head><style>a { color: #36a; }</style></head><body></body></html>`;
    const result = extractBranding(html, BASE_URL);
    expect(result.colors).toContain("#3366aa");
  });

  it("extracts RGB colors and converts to hex", () => {
    const html = `<html><head><style>a { color: rgb(37, 99, 235); }</style></head><body></body></html>`;
    const result = extractBranding(html, BASE_URL);
    expect(result.colors).toContain("#2563eb");
  });

  it("filters out near-white and near-black colors", () => {
    const html = `<html><head><style>a { color: #ffffff; b { color: #000000; } c { color: #f9f9f9; } }</style></head><body></body></html>`;
    const result = extractBranding(html, BASE_URL);
    expect(result.colors).not.toContain("#ffffff");
    expect(result.colors).not.toContain("#000000");
    expect(result.colors).not.toContain("#f9f9f9");
  });

  it("returns at most 5 colors", () => {
    const html = `<html><head><style>
      .a{color:#2563eb}.b{color:#10b981}.c{color:#f59e0b}.d{color:#ef4444}.e{color:#8b5cf6}.f{color:#ec4899}
    </style></head><body></body></html>`;
    const result = extractBranding(html, BASE_URL);
    expect(result.colors.length).toBeLessThanOrEqual(5);
  });

  it("extracts font families from CSS declarations", () => {
    const html = `<html><head><style>body { font-family: 'Roboto', sans-serif; }</style></head><body></body></html>`;
    const result = extractBranding(html, BASE_URL);
    expect(result.fonts).toContain("roboto");
  });

  it("extracts Google Fonts from link tags", () => {
    const html = `<html><head><link href="https://fonts.googleapis.com/css?family=Open+Sans|Lato" rel="stylesheet"></head><body></body></html>`;
    const result = extractBranding(html, BASE_URL);
    expect(result.fonts).toContain("open sans");
    expect(result.fonts).toContain("lato");
  });

  it("filters generic font families", () => {
    const html = `<html><head><style>body { font-family: sans-serif, Arial; }</style></head><body></body></html>`;
    const result = extractBranding(html, BASE_URL);
    expect(result.fonts).not.toContain("sans-serif");
  });

  it("extracts logo from img with 'logo' in src", () => {
    const html = `<html><body><img src="/images/logo.png" alt="Company"></body></html>`;
    const result = extractBranding(html, BASE_URL);
    expect(result.logoUrl).toBe("https://example.com/images/logo.png");
  });

  it("extracts logo from img with 'logo' in alt", () => {
    const html = `<html><body><img src="/images/brand.png" alt="Our Logo"></body></html>`;
    const result = extractBranding(html, BASE_URL);
    expect(result.logoUrl).toBe("https://example.com/images/brand.png");
  });

  it("extracts logo from img inside header", () => {
    const html = `<html><body><header><img src="/header-img.png" alt="Site"></header></body></html>`;
    const result = extractBranding(html, BASE_URL);
    expect(result.logoUrl).toBe("https://example.com/header-img.png");
  });

  it("returns null logoUrl when no logo found", () => {
    const html = `<html><body><img src="/photo.jpg" alt="Nice photo"></body></html>`;
    const result = extractBranding(html, BASE_URL);
    expect(result.logoUrl).toBeNull();
  });

  it("returns empty arrays gracefully for empty HTML", () => {
    const result = extractBranding("", BASE_URL);
    expect(result.colors).toEqual([]);
    expect(result.fonts).toEqual([]);
    expect(result.logoUrl).toBeNull();
  });

  it("resolves absolute logo URL correctly", () => {
    const html = `<html><body><img src="https://cdn.example.com/logo.svg" alt="logo"></body></html>`;
    const result = extractBranding(html, BASE_URL);
    expect(result.logoUrl).toBe("https://cdn.example.com/logo.svg");
  });
});
