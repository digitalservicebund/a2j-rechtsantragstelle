import escape from "lodash/escape";
import type { Replacements } from "~/util/applyStringReplacement";
import type { UserData } from "~/domains/userData";
import {
  calculateInheritance,
  type InheritanceInput,
} from "../shared/calculateInheritance";
import { spouseFromUserData } from "./resultExtras";
import {
  collectRequiredDocuments,
  type PersonDocuments,
} from "./requiredDocuments";
import { missingChildrenReplacements } from "~/domains/nachlass/erbschein/shared/stringReplacements";

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
    testamentArt?: string;
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
    // Gate content on the "keine gesetzliche Erbfolge" exit page: a will of any
    // kind vs. an inheritance contract.
    hasTestament:
      data.testamentArt === "handwritten" || data.testamentArt === "notarized",
    hasErbvertrag: data.testamentArt === "erbvertrag",
  };
}
