import mustache from "mustache";

export type Replacements = Record<string, string | boolean | undefined>;

export function recursivelyReplaceStrings<T>(
  content: T,
  stringReplacements?: Replacements,
): T {
  if (!stringReplacements || !content) return content;
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
      .map((item) => recursivelyReplaceStrings(item, stringReplacements))
      .filter((item) => item !== undefined) as T;
  }

  return Object.fromEntries(
    Object.entries(content)
      .map(([key, value]) => [
        key,
        recursivelyReplaceStrings(value, stringReplacements),
      ])
      .filter(([, value]) => value !== undefined),
  );
}
