import mustache from "mustache";

export type Replacements = Record<string, string | boolean | undefined>;

export function applyStringReplacement<T>(
  content: T,
  replacements?: Replacements,
  skipIndexArrayReplacement = false,
) {
  if (!replacements) return content;
  return deeplyReplaceTemplateStrings(
    content,
    replacements,
    skipIndexArrayReplacement,
  );
}

function deeplyReplaceTemplateStrings<T>(
  content: T,
  stringReplacements?: Replacements,
  skipIndexArrayReplacement = false,
): T {
  if (!content || typeof content === "number" || typeof content === "boolean")
    return content;

  // For array summaries, we might have a string that contains "indexArray" which we want to skip replacing in the back-end
  // This is because the indexArray is used in the front-end to display the correct index
  if (
    typeof content === "string" &&
    content.includes("indexArray") &&
    skipIndexArrayReplacement
  ) {
    return content;
  }

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
      .map((item) =>
        deeplyReplaceTemplateStrings(
          item,
          stringReplacements,
          skipIndexArrayReplacement,
        ),
      )
      .filter((item) => item !== undefined) as T;
  }

  return Object.fromEntries(
    Object.entries(content)
      .map(([key, value]) => [
        key,
        deeplyReplaceTemplateStrings(
          value,
          stringReplacements,
          skipIndexArrayReplacement,
        ),
      ])
      .filter(([, value]) => value !== undefined),
  );
}
