import mustache from "mustache";

export type Replacements = Record<string, string | boolean | undefined>;

export function applyStringReplacement<T>(
  content: T,
  replacements?: Replacements,
) {
  if (!replacements) return content;
  return deeplyReplaceTemplateStrings(content, replacements);
}

function deeplyReplaceTemplateStrings<T>(
  content: T,
  stringReplacements?: Replacements,
): T {
  if (!content || typeof content === "number") return content;
  if (typeof content === "string") {
    return mustache.render(content, stringReplacements) as T;
  }

  // Need to filter out content that shouldn't be visible
  if (
    typeof content === "object" &&
    "isVisible" in content &&
    typeof content.isVisible === "string" &&
    mustache.render(`{{${content.isVisible}}}`, stringReplacements) === "false"
  ) {
    return undefined as T;
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => deeplyReplaceTemplateStrings(item, stringReplacements))
      .filter((item) => item !== undefined) as T;
  }

  return Object.fromEntries(
    Object.entries(content)
      .map(([key, value]) => [
        key,
        deeplyReplaceTemplateStrings(value, stringReplacements),
      ])
      .filter(([, value]) => value !== undefined),
  );
}
