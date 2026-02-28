import { describe, it, expect } from "vitest";
import { interpolate } from "../../src/lib/utils/interpolate";

describe("interpolate", () => {
  it("replaces simple tokens", () => {
    expect(interpolate("Hello {{name}}!", { name: "World" })).toBe(
      "Hello World!",
    );
  });

  it("replaces multiple tokens", () => {
    expect(
      interpolate("{{greeting}} {{name}}", { greeting: "Hi", name: "Alice" }),
    ).toBe("Hi Alice");
  });

  it("replaces dot-notation nested keys", () => {
    expect(
      interpolate("{{business.name}} — {{business.phone}}", {
        business: { name: "Acme", phone: "555-1234" },
      }),
    ).toBe("Acme — 555-1234");
  });

  it("leaves unknown tokens empty by default", () => {
    expect(interpolate("Hello {{unknown}}!", {})).toBe("Hello !");
  });

  it("keeps unknown tokens when keepUnknown is true", () => {
    expect(
      interpolate("Hello {{unknown}}!", {}, { keepUnknown: true }),
    ).toBe("Hello {{unknown}}!");
  });

  it("handles {{#each}} blocks with object arrays", () => {
    const template = "{{#each items}}{{name}}, {{/each}}";
    const result = interpolate(template, {
      items: [{ name: "A" }, { name: "B" }, { name: "C" }],
    });
    expect(result).toBe("A, B, C, ");
  });

  it("handles {{#each}} with primitive arrays using this", () => {
    const template = "{{#each tags}}[{{this}}]{{/each}}";
    const result = interpolate(template, { tags: ["x", "y", "z"] });
    expect(result).toBe("[x][y][z]");
  });

  it("returns empty string for missing #each array by default", () => {
    expect(interpolate("{{#each missing}}item{{/each}}", {})).toBe("");
  });

  it("leaves #each block unchanged when keepUnknown=true and array missing", () => {
    const tpl = "{{#each missing}}item{{/each}}";
    expect(interpolate(tpl, {}, { keepUnknown: true })).toBe(tpl);
  });

  it("converts numeric values to strings", () => {
    expect(interpolate("Count: {{count}}", { count: 42 })).toBe("Count: 42");
  });

  it("handles deeply nested dot notation", () => {
    expect(
      interpolate("{{a.b.c}}", { a: { b: { c: "deep" } } }),
    ).toBe("deep");
  });
});
