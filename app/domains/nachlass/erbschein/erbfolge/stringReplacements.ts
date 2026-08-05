import escape from "lodash/escape";
import type { Replacements } from "~/util/applyStringReplacement";
import type { UserData } from "~/domains/userData";
import {
  calculateInheritance,
  type InheritanceInput,
} from "./calculateInheritance";
import { spouseFromUserData } from "./resultExtras";
import {
  collectMissingChildrenNames,
  collectMissingChildrenNamesForElternteile,
} from "./missingChildren";
import {
  collectRequiredDocuments,
  type PersonDocuments,
} from "./requiredDocuments";

// Rendered into the CMS content via the triple-brace {{{missingChildrenNamesHtml}}}
// placeholder (triple braces mean "insert as raw HTML"), e.g. inside a notice.
function buildMissingChildrenNamesHtml(names: string[]): string {
  const items = names.map((name) => `<li>${escape(name)}</li>`).join("");
  return `<ul>${items}</ul>`;
}

// Everyone the flow knows died and had children, but whose children were never
// entered. The "kinder fehlen" (children missing) exit page lists them so the
// user knows who is still missing.
function missingChildrenReplacements(
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

// The documents every person in the result needs to provide, as a table.
// Rendered into the result page via the triple-brace {{{requiredDocumentsHtml}}}.
function buildRequiredDocumentsHtml(
  requiredDocuments: PersonDocuments[],
): string {
  const rows = requiredDocuments
    .map(
      ({ name, documents }) =>
        `<tr><td class="font-semibold pr-24 pb-kern-space-small align-top">${escape(name)}</td>` +
        `<td class="pb-kern-space-small">${documents}</td></tr>`,
    )
    .join("");
  return `<table class="w-full"><tbody>${rows}</tbody></table>`;
}

export function nachlassErbfolgeStringReplacements(
  context: UserData,
): Replacements {
  const data = context as InheritanceInput & {
    verstorbeneVorname?: string;
    verstorbeneNachname?: string;
    hatteKinder?: string;
  };

  return {
    // The raw answers, so CMS text can reference them directly (e.g. {{name}}
    // is the deceased's name). Page-specific values that these can't express
    // (the name of the list item the user is currently inside) are added
    // separately in the route's loader extras.
    ...(context as Replacements),
    ...missingChildrenReplacements(data),
    requiredDocumentsHtml: buildRequiredDocumentsHtml(
      collectRequiredDocuments(data),
    ),
    // Gates the "Erbengemeinschaft" notice on the result page: it only applies
    // when the estate is shared, i.e. more than one heir inherits.
    hasMultipleHeirs:
      calculateInheritance({ ...data, spouse: spouseFromUserData(data) })
        .length > 1,
  };
}
