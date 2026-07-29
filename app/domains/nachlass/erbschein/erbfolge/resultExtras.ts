import { type z } from "zod";
import escape from "lodash/escape";
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

// Only the main result page gets the heir list + required documents. The other
// result pages are the "not determined" exit pages, which show neither.
const ERBFOLGE_STEP_ID = "/ergebnis/erbfolge";
const HEIRS_LIST_IDENTIFIER = "heirsList";
// A `page.inline-notice` authored in Strapi's freeZone with this identifier holds the
// "Erbanteile können nicht ermittelt werden" copy. We show it (and hide the heir list)
// only when the spouse's share can't be determined.
const EHEVERTRAG_UNKNOWN_NOTICE_IDENTIFIER = "ehevertragUnbekanntHinweis";

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

// The spouse's share (and therefore every share) can't be determined when the user gave
// no precise Ehevertrag / Güterstand ("Ich weiß es nicht" / "Sonstige"). Only relevant
// when a spouse exists.
function spouseShareUndeterminable(userData: InheritanceInput): boolean {
  const { ehepartnerName, ehevertrag, gueterstand } = userData as {
    ehepartnerName?: string;
    ehevertrag?: string;
    gueterstand?: Gueterstand;
  };
  if (!ehepartnerName) return false;
  if (ehevertrag === "unknown") return true;
  return gueterstand === "other" || gueterstand === "unknown";
}

function identifierOf(component: object): string | undefined {
  return "identifier" in component
    ? (component.identifier as string | undefined)
    : undefined;
}

export const erbfolgeResultExtras: ResultLoaderExtras = {
  transformContent: (
    content: StrapiResultPage,
    context: ResultExtrasContext,
  ): StrapiResultPage => {
    if (context.stepId !== ERBFOLGE_STEP_ID) return content;

    const userData = context.userData as InheritanceInput;
    const deceasedName = (context.userData as { name?: string }).name ?? "";
    const undeterminable = spouseShareUndeterminable(userData);

    const freeZone = content.freeZone
      // The "can't be determined" notice shows only when shares are undeterminable;
      // the heir list only when they can be determined.
      .filter((component) => {
        const identifier = identifierOf(component);
        if (identifier === EHEVERTRAG_UNKNOWN_NOTICE_IDENTIFIER) {
          return undeterminable;
        }
        if (identifier === HEIRS_LIST_IDENTIFIER) return !undeterminable;
        return true;
      })
      .map((component) =>
        component.__component === "page.list" &&
        component.identifier === HEIRS_LIST_IDENTIFIER
          ? {
              ...component,
              items: buildHeirListItems(
                calculateInheritance({
                  ...userData,
                  spouse: spouseFromUserData(userData),
                }),
                deceasedName,
              ),
              variant: "unordered" as const,
            }
          : component,
      );

    return { ...content, freeZone };
  },
};
