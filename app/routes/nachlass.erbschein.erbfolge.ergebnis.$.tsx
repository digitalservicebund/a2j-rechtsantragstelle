import {
  data,
  type LoaderFunctionArgs,
  redirect,
  useLoaderData,
} from "react-router";
import { throw404OnProduction } from "~/services/errorPages/throw404";
import { parsePathname } from "~/domains/flowIds";
import { nachlassErbfolgeStaticFlow } from "~/domains/nachlass/erbschein/erbfolge/flowConfig";
import type { Replacements } from "~/util/applyStringReplacement";
import { resolveArrayCharacter } from "~/services/array/resolveArrayCharacter";
import { fetchFlowPage } from "~/services/cms/index.server";
import { applyStringReplacement } from "~/util/applyStringReplacement";
import { addPageDataToUserData } from "~/services/flow/pageData";
import { createFlowSession } from "~/services/flow/newFlowEngine/createFlowSession";
import { getSessionData } from "~/services/session.server";
import { getButtonNavigationProps } from "~/util/buttonProps";
import {
  calculateInheritance,
  type HeirShare,
  type InheritanceInput,
} from "~/domains/nachlass/erbschein/erbfolge/calculateInheritance";
import type { Gueterstand } from "~/domains/nachlass/erbschein/erbfolge/pages";
import {
  collectRequiredDocuments,
  type PersonDocuments,
} from "~/domains/nachlass/erbschein/erbfolge/requiredDocuments";
import { type StrapiListItemSchema } from "~/services/cms/models/content/StrapiListItem";
import { type z } from "zod";
import { ResultPageView } from "./shared/components/ResultPage";

const staticFlow = nachlassErbfolgeStaticFlow;
const ERBFOLGE_STEP_ID = "/ergebnis/erbfolge";

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

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

const HEIRS_LIST_IDENTIFIER = "heirsList";

type StrapiListItems = Array<z.output<typeof StrapiListItemSchema>>;

// The heirs become the items of the CMS List component whose identifier
// is "heirsList", so they render with the List's own markers and spacing.
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
    content: `<p>Erbt als ${relationshipLabel(heir)} von ${escapeHtml(deceasedName)}</p>`,
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
        `<tr><td class="font-semibold pr-24 pb-kern-space-small align-top">${escapeHtml(name)}</td>` +
        `<td class="pb-kern-space-small">${documents}</td></tr>`,
    )
    .join("");
  return `<table class="w-full"><tbody>${rows}</tbody></table>`;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  throw404OnProduction();
  const { pathname } = new URL(request.url);
  const cookieHeader = request.headers.get("Cookie");
  const { flowId, stepId, arrayIndexes } = parsePathname(
    pathname.replace(/\.data$/, ""),
  );
  const fullUserData = addPageDataToUserData(
    await getSessionData(flowId, cookieHeader),
    { arrayIndexes },
  );

  const flowSession = createFlowSession(
    staticFlow,
    fullUserData as Parameters<typeof createFlowSession>[1],
    stepId,
  );

  if (!flowSession.isReachable(stepId)) {
    return redirect(flowId + flowSession.initialPath);
  }

  const cmsStepId = stepId.replace("/ergebnis", "");
  const { prunedUserData } = flowSession;
  const deceasedName = (prunedUserData.name as string | undefined) ?? "";

  const ehepartnerName = prunedUserData.ehepartnerName as string | undefined;
  const spouse = ehepartnerName
    ? {
        name: ehepartnerName,
        gueterstand:
          (prunedUserData.gueterstand as Gueterstand | undefined) ??
          "communityOfAcquisitions",
      }
    : undefined;

  const isErbfolgeResult = stepId === ERBFOLGE_STEP_ID;
  const replacements: Replacements = {
    ...(prunedUserData as Replacements),
    ...(isErbfolgeResult && {
      requiredDocumentsHtml: buildRequiredDocumentsHtml(
        collectRequiredDocuments(prunedUserData),
      ),
    }),
  };

  const rawPage = applyStringReplacement(
    await fetchFlowPage("result-pages", flowId, cmsStepId),
    replacements,
  );

  const heirListItems = isErbfolgeResult
    ? buildHeirListItems(
        calculateInheritance({
          ...(prunedUserData as InheritanceInput),
          spouse,
        }),
        deceasedName,
      )
    : null;

  const cmsContent = {
    ...rawPage,
    freeZone: rawPage.freeZone.map((component) =>
      heirListItems &&
      component.__component === "page.list" &&
      component.identifier === HEIRS_LIST_IDENTIFIER
        ? { ...component, items: heirListItems, variant: "unordered" as const }
        : component,
    ),
    documents: rawPage.documents?.element ?? [],
    nextSteps: rawPage.nextSteps?.element ?? [],
  };

  const prevStepId = flowSession.prevPath;
  const backDestination = prevStepId
    ? flowId + resolveArrayCharacter(prevStepId, arrayIndexes, false)
    : undefined;

  return data({
    cmsContent,
    buttonNavigationProps: getButtonNavigationProps({
      backButtonLabel: cmsContent.backButtonLabel ?? "Zurück",
      nextButtonLabel: cmsContent.nextLink?.text ?? "Weiter",
      backDestination,
    }),
  });
};

function ErbfolgeResultPage() {
  const { cmsContent, buttonNavigationProps } = useLoaderData<typeof loader>();

  return (
    <ResultPageView
      cmsContent={cmsContent}
      buttonNavigationProps={buttonNavigationProps}
    />
  );
}

export default ErbfolgeResultPage;
