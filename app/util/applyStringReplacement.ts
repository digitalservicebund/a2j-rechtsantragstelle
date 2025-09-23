import mustache from "mustache";
import type { Flow } from "~/domains/flows.server";
import type { UserData } from "~/domains/userData";
import { logError } from "~/services/logging";

export type Replacements = Record<string, string | boolean | undefined>;

export const replacementsFromFlowConfig = (
  stringReplacements: Flow["stringReplacements"],
  userData: UserData,
) => (stringReplacements ? stringReplacements(userData) : undefined);

export function applyStringReplacement<T>(
  content: T,
  replacements?: Replacements,
  skipIndexArrayReplacement = false,
): T {
  try {
    if (
      !content ||
      !replacements ||
      typeof content === "number" ||
      typeof content === "boolean"
    )
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
      return mustache.render(content, replacements) as T;
    }

    // Need to filter out content that shouldn't be visible
    if (
      typeof content === "object" &&
      "isVisible" in content &&
      typeof content.isVisible === "string" &&
      mustache.render(`{{${content.isVisible}}}`, replacements) === "false"
    ) {
      return undefined as T;
    }

    if (Array.isArray(content)) {
      return content
        .map((item) =>
          applyStringReplacement(item, replacements, skipIndexArrayReplacement),
        )
        .filter((item) => item !== undefined) as T;
    }

    return Object.fromEntries(
      Object.entries(content)
        .map(([key, value]) => [
          key,
          applyStringReplacement(
            value,
            replacements,
            skipIndexArrayReplacement,
          ),
        ])
        .filter(([, value]) => value !== undefined),
    );
  } catch (e) {
    logError({ message: "Could not apply string replacements", error: e });
    return content;
  }
}
