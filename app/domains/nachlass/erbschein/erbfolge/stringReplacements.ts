import type { Replacements } from "~/util/applyStringReplacement";
import type { UserData } from "~/domains/userData";
import type { InheritanceInput } from "./calculateInheritance";
import {
  collectMissingChildrenNames,
  collectMissingChildrenNamesForElternteile,
} from "./missingChildren";

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

// Rendered into the CMS content via the triple-brace {{{missingChildrenNamesHtml}}}
// placeholder (triple braces mean "insert as raw HTML"), e.g. inside a notice.
function buildMissingChildrenNamesHtml(names: string[]): string {
  return `<ul>${names.map((name) => `<li>${escapeHtml(name)}</li>`).join("")}</ul>`;
}

// Everyone the flow knows died and had children, but whose children were never
// entered. The "kinder fehlen" (children missing) exit page lists them so the
// user knows who is still missing.
function missingChildrenReplacements(
  data: InheritanceInput & { name?: string; hatteKinder?: string },
): Replacements {
  const missingChildrenNames = [
    // Treat the deceased as the root of the children tree so both cases are
    // caught: nobody was added at all, and a specific descendant deeper down
    // with the same gap.
    ...collectMissingChildrenNames([
      {
        name: data.name ?? "",
        isAlive: "no",
        hatteKinder: data.hatteKinder,
        kinder: data.kinder,
      },
    ]),
    ...collectMissingChildrenNamesForElternteile(data.elternteile ?? []),
  ];

  if (missingChildrenNames.length === 0) return {};

  return {
    missingChildrenNames: missingChildrenNames.join(", "),
    missingChildrenNamesHtml:
      buildMissingChildrenNamesHtml(missingChildrenNames),
  };
}

export function nachlassErbfolgeStringReplacements(
  context: UserData,
): Replacements {
  return {
    // The raw answers, so CMS text can reference them directly (e.g. {{name}}
    // is the deceased's name). Page-specific values that these can't express
    // (the name of the list item the user is currently inside) are added
    // separately in the route's loader extras.
    ...(context as Replacements),
    ...missingChildrenReplacements(
      context as InheritanceInput & { name?: string; hatteKinder?: string },
    ),
  };
}
