// Rendered into the CMS content via the triple-brace {{{missingChildrenNamesHtml}}}

import { type InheritanceInput } from "~/domains/nachlass/erbschein/shared/calculateInheritance";
import {
  collectMissingChildrenNames,
  collectMissingChildrenNamesForElternteile,
} from "~/domains/nachlass/erbschein/shared/missingChildren";
import { type Replacements } from "~/util/applyStringReplacement";
import escape from "lodash/escape";

// placeholder (triple braces mean "insert as raw HTML"), e.g. inside a notice.
function buildMissingChildrenNamesHtml(names: string[]): string {
  const items = names.map((name) => `<li>${escape(name)}</li>`).join("");
  return `<ul>${items}</ul>`;
}

// Everyone the flow knows died and had children, but whose children were never
// entered. The "kinder fehlen" (children missing) exit page lists them so the
// user knows who is still missing.
export function missingChildrenReplacements(
  data: InheritanceInput & {
    verstorbeneVorname?: string;
    verstorbeneNachname?: string;
    hatteKinder?: string;
  },
): Replacements {
  const missingChildrenNames = [
    // Treat the deceased as the root of the children tree so both cases are
    // caught: nobody was added at all, and a specific descendant deeper down
    // with the same gap.
    ...collectMissingChildrenNames([
      {
        vorname: data.verstorbeneVorname,
        nachname: data.verstorbeneNachname,
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
