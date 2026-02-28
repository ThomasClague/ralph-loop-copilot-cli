/**
 * Retrieves a nested value from an object using dot notation (e.g. "business.name").
 */
function getNestedValue(
  data: Record<string, unknown>,
  key: string,
): unknown {
  return key.split(".").reduce<unknown>((obj, part) => {
    if (obj && typeof obj === "object" && !Array.isArray(obj)) {
      return (obj as Record<string, unknown>)[part];
    }
    return undefined;
  }, data);
}

/**
 * Replaces {{key}} tokens (including dot-notation) with values from `data`.
 * If keepUnknown is true, unresolved tokens are left as-is; otherwise replaced with "".
 */
function replaceTokens(
  template: string,
  data: Record<string, unknown>,
  keepUnknown: boolean,
): string {
  return template.replace(/\{\{([^#/][^}]*)\}\}/g, (match, key: string) => {
    const trimmed = key.trim();
    const value = getNestedValue(data, trimmed);
    if (value === undefined || value === null) {
      return keepUnknown ? match : "";
    }
    return String(value);
  });
}

/**
 * Processes {{#each arrayKey}}...{{/each}} blocks by repeating the inner template
 * for each item in the array.
 */
function processEachBlocks(
  template: string,
  data: Record<string, unknown>,
  keepUnknown: boolean,
): string {
  const eachRegex = /\{\{#each ([^}]+)\}\}([\s\S]*?)\{\{\/each\}\}/g;
  return template.replace(eachRegex, (_match, key: string, inner: string) => {
    const trimmed = key.trim();
    const arr = getNestedValue(data, trimmed);
    if (!Array.isArray(arr)) return keepUnknown ? _match : "";
    return arr
      .map((item) => {
        const itemData: Record<string, unknown> =
          typeof item === "object" && item !== null
            ? (item as Record<string, unknown>)
            : { this: item };
        return replaceTokens(inner, itemData, keepUnknown);
      })
      .join("");
  });
}

/**
 * Interpolates a template string by replacing {{variable}} tokens with values
 * from `data`. Supports dot notation and {{#each}} blocks.
 *
 * @param template - The template string with {{token}} placeholders
 * @param data     - Key/value map for token replacement
 * @param options  - { keepUnknown: true } to leave unknown tokens as-is (default: false → "")
 */
export function interpolate(
  template: string,
  data: Record<string, unknown>,
  options?: { keepUnknown?: boolean },
): string {
  const keepUnknown = options?.keepUnknown ?? false;
  let result = processEachBlocks(template, data, keepUnknown);
  result = replaceTokens(result, data, keepUnknown);
  return result;
}
