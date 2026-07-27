import { type z } from "zod";
import escape from "lodash/escape";
import { type Replacements } from "~/util/applyStringReplacement";
import { type StrapiListItemSchema } from "~/services/cms/models/content/StrapiListItem";
import { type StrapiResultPage } from "~/services/cms/models/StrapiResultPage";
import type {
  ResultExtrasContext,
  ResultLoaderExtras,
} from "~/routes/shared/newEngineResult.server";
import {
  calculateInheritance,
  type HeirShare,
  type InheritanceInput,
} from "./calculateInheritance";
import type { Gueterstand } from "./pages";
import {
  collectRequiredDocuments,
  type PersonDocuments,
} from "./requiredDocuments";

// Only the main result page gets the heir list + required documents. The other
// result pages are the "not determined" exit pages, which show neither.
const ERBFOLGE_STEP_ID = "/ergebnis/erbfolge";
const HEIRS_LIST_IDENTIFIER = "heirsList";

const FIRST_ORDER_LABELS = [
  "Kind",
  "Enkelkind",
  "Urenkel",
  "Ururgroßenkel",
  "Urururgroßenkel",
];
const SECOND_ORDER_LABELS = ["Elternteil", "Geschwister", "Nichte oder Neffe"];

function relationshipLabel(heir: HeirShare): string {
  if (heir.order === 0) return "Ehepartner";
  if (heir.order === 1) {
    return (
      FIRST_ORDER_LABELS[heir.depth - 1] ?? `Abkömmling (${heir.depth}. Grad)`
    );
  }
  return SECOND_ORDER_LABELS[heir.depth] ?? `Verwandter (${heir.depth}. Grad)`;
}

function shareLabel({ numerator, denominator }: HeirShare["share"]): string {
  if (numerator === denominator) return "das gesamte Erbe";
  return `${numerator}/${denominator} des Erbes`;
}

type StrapiListItems = Array<z.output<typeof StrapiListItemSchema>>;

// The heirs become the items of the CMS List component whose identifier is
// "heirsList", so they render with the List's own markers and spacing.
function buildHeirListItems(
  heirShares: HeirShare[],
  deceasedName: string,
): StrapiListItems {
  return heirShares.map((heir, index) => ({
    id: index + 1,
    headline: {
      __component: "basic.heading" as const,
      id: index + 1,
      text: `${heir.name} (erhält ${shareLabel(heir.share)})`,
      tagName: "h3" as const,
    },
    content: `<p>Erbt als ${relationshipLabel(heir)} von ${escape(deceasedName)}</p>`,
    buttons: [],
    // The parsed type requires the key even though the renderer treats it as optional
    accordion: undefined as unknown as StrapiListItems[number]["accordion"],
  }));
}

// Injected into the CMS content via {{{requiredDocumentsHtml}}} (triple braces: raw HTML).
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

function spouseFromUserData(userData: InheritanceInput) {
  const ehepartnerName = (userData as { ehepartnerName?: string })
    .ehepartnerName;
  if (!ehepartnerName) return undefined;
  return {
    name: ehepartnerName,
    gueterstand:
      (userData as { gueterstand?: Gueterstand }).gueterstand ??
      "communityOfAcquisitions",
  };
}

export const erbfolgeResultExtras: ResultLoaderExtras = {
  buildReplacements: (context: ResultExtrasContext): Replacements => {
    if (context.stepId !== ERBFOLGE_STEP_ID) return {};
    return {
      requiredDocumentsHtml: buildRequiredDocumentsHtml(
        collectRequiredDocuments(context.userData as InheritanceInput),
      ),
    };
  },

  transformContent: (
    content: StrapiResultPage,
    context: ResultExtrasContext,
  ): StrapiResultPage => {
    if (context.stepId !== ERBFOLGE_STEP_ID) return content;

    const userData = context.userData as InheritanceInput;
    const deceasedName = (context.userData as { name?: string }).name ?? "";

    const heirListItems = buildHeirListItems(
      calculateInheritance({
        ...userData,
        spouse: spouseFromUserData(userData),
      }),
      deceasedName,
    );

    return {
      ...content,
      freeZone: content.freeZone.map((component) =>
        component.__component === "page.list" &&
        component.identifier === HEIRS_LIST_IDENTIFIER
          ? {
              ...component,
              items: heirListItems,
              variant: "unordered" as const,
            }
          : component,
      ),
    };
  },
};
