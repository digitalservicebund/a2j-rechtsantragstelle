import escape from "lodash/escape";
import type { Replacements } from "~/util/applyStringReplacement";
import type { UserData } from "~/domains/userData";
import { determineHeirs } from "./determineHeirs";
import {
  collectMissingChildrenNames,
  collectMissingChildrenNamesForElternteile,
} from "~/domains/nachlass/erbschein/shared/missingChildren";
import { type ErbfolgeData } from "~/domains/nachlass/erbschein/shared/erbfolgeTypes";

// placeholder (triple braces mean "insert as raw HTML"), e.g. inside a notice.
function buildMissingChildrenNamesHtml(names: string[]): string {
  const items = names.map((name) => `<li>${escape(name)}</li>`).join("");
  return `<ul>${items}</ul>`;
}

// Everyone the flow knows died and had children, but whose children were never
// entered. The "kinder fehlen" (children missing) exit page lists them so the
// user knows who is still missing.
function missingChildrenReplacements(data: ErbfolgeData): Replacements {
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

export function nachlassErbfolgeStringReplacements(
  context: UserData,
): Replacements {
  return {
    // The raw answers, so CMS text can reference them directly (e.g. {{name}}
    // is the deceased's name). Page-specific values that these can't express
    // (the name of the list item the user is currently inside) are added
    // separately in the route's loader extras.
    ...(context as Replacements),
    ...missingChildrenReplacements(context),
    // Gates the "Erbengemeinschaft" notice on the result page: it only applies
    // when the estate is shared, i.e. more than one heir inherits.
    hasMultipleHeirs: determineHeirs(context).length > 1,
    // Gate content on the "keine gesetzliche Erbfolge" exit page: a will of any
    // kind vs. an inheritance contract.
    hasTestament:
      context.testamentArt === "handwritten" ||
      context.testamentArt === "notarized",
    hasErbvertrag: context.testamentArt === "erbvertrag",
  };
}
