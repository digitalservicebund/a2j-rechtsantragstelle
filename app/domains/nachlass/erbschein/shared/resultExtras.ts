import { type z } from "zod";
import escape from "lodash/escape";
import { type StrapiListItemSchema } from "~/services/cms/models/content/StrapiListItem";
import { type StrapiResultPage } from "~/services/cms/models/StrapiResultPage";
import type {
  ResultExtrasContext,
  ResultLoaderExtras,
} from "~/routes/shared/newEngineResult.server";
import {
  determineHeirs,
  shareLabel,
  type Gueterstand,
  type Heir,
} from "./determineHeirs";
import { personName } from "./personName";
import {
  FIRST_ORDER_LABELS,
  SECOND_ORDER_LABELS,
} from "~/domains/nachlass/erbschein/shared/erbfolgeLabels";
import { type ErbfolgeData } from "~/domains/nachlass/erbschein/shared/erbfolgeTypes";

// Only the main result page gets the heir list + required documents. The other
// result pages are the "not determined" exit pages, which show neither.
const ERBFOLGE_STEP_ID = "/ergebnis/erbfolge";
export const HEIRS_LIST_IDENTIFIER = "heirsList";
// A `page.inline-notice` authored in Strapi's freeZone with this identifier holds the
// "Erbanteile können nicht ermittelt werden" copy. We show it (and hide the heir list)
// only when the spouse's share can't be determined.
const EHEVERTRAG_UNKNOWN_NOTICE_IDENTIFIER = "ehevertragUnbekanntHinweis";

function relationshipLabel(heir: Heir): string {
  if (heir.order === 0) return "Ehepartner";
  if (heir.order === 1) {
    return (
      FIRST_ORDER_LABELS[heir.depth - 1] ?? `Abkömmling (${heir.depth}. Grad)`
    );
  }
  return SECOND_ORDER_LABELS[heir.depth] ?? `Verwandter (${heir.depth}. Grad)`;
}

type StrapiListItems = Array<z.output<typeof StrapiListItemSchema>>;

// The heirs become the items of the CMS List component whose identifier is
// "heirsList", so they render with the List's own markers and spacing.
// showShares is false when the spouse's share (and therefore every share) can't
// be determined: we still list the heirs, just without their fractions.
function buildHeirListItems(
  heirs: Heir[],
  deceasedName: string,
  showShares: boolean,
): StrapiListItems {
  return heirs.map((heir, index) => ({
    id: index + 1,
    headline: {
      __component: "basic.heading" as const,
      id: index + 1,
      text: showShares
        ? `${heir.name} (erhält ${shareLabel(heir.share)})`
        : heir.name,
      tagName: "h3" as const,
    },
    content: `<p>Erbt als ${relationshipLabel(heir)} von ${escape(deceasedName)}</p>`,
    buttons: [],
    // The parsed type requires the key even though the renderer treats it as optional
    accordion: undefined as unknown as StrapiListItems[number]["accordion"],
  }));
}

// The spouse's share (and therefore every share) can't be determined when the user gave
// no precise Ehevertrag / Güterstand ("Ich weiß es nicht" / "Sonstige"). Only relevant
// when a spouse exists.
function spouseShareUndeterminable(userData: ErbfolgeData): boolean {
  const { ehepartnerVorname, ehepartnerNachname, ehevertrag, gueterstand } =
    userData as {
      ehepartnerVorname?: string;
      ehepartnerNachname?: string;
      ehevertrag?: string;
      gueterstand?: Gueterstand;
    };
  if (!ehepartnerVorname && !ehepartnerNachname) return false;
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

    const userData = context.userData as ErbfolgeData;
    const { verstorbeneVorname, verstorbeneNachname } = context.userData as {
      verstorbeneVorname?: string;
      verstorbeneNachname?: string;
    };
    const deceasedName = personName({
      vorname: verstorbeneVorname,
      nachname: verstorbeneNachname,
    });
    const heirs = determineHeirs(userData);

    // When the spouse inherits alone they take the whole estate (1/1) regardless of
    // the Ehevertrag, so the share is always determinable in that case.
    const spouseInheritsAlone = heirs.length === 1 && heirs[0].order === 0;
    const undeterminable =
      spouseShareUndeterminable(userData) && !spouseInheritsAlone;

    const freeZone = content.freeZone
      // The "can't be determined" notice shows only when shares are undeterminable.
      // The heir list is always shown; its shares are hidden when undeterminable.
      .filter((component) => {
        const identifier = identifierOf(component);
        if (identifier === EHEVERTRAG_UNKNOWN_NOTICE_IDENTIFIER) {
          return undeterminable;
        }
        return true;
      })
      .map((component) =>
        component.__component === "page.list" &&
        component.identifier === HEIRS_LIST_IDENTIFIER
          ? {
              ...component,
              items: buildHeirListItems(heirs, deceasedName, !undeterminable),
              variant: "unordered" as const,
            }
          : component,
      );

    return { ...content, freeZone };
  },
};
