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
import { GridSection } from "~/components/layout/grid/GridSection";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { Icon } from "~/components/common/Icon";
import Heading from "~/components/common/Heading";
import RichText from "~/components/common/RichText";
import ContentComponents from "~/components/content/ContentComponents";
import ButtonContainer from "~/components/common/ButtonContainer";

const staticFlow = nachlassErbfolgeStaticFlow;

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
  const replacements = { ...flowSession.prunedUserData } as Replacements;

  let cmsContent = null;
  try {
    const rawPage = applyStringReplacement(
      await fetchFlowPage("result-pages", flowId, cmsStepId),
      replacements,
    );
    cmsContent = {
      ...rawPage,
      documents: rawPage.documents?.element ?? [],
      nextSteps: rawPage.nextSteps?.element ?? [],
    };
  } catch {
    // CMS entry not yet created — heir list still renders
  }

  const { prunedUserData } = flowSession;
  const ehepartnerName = prunedUserData.ehepartnerName as string | undefined;
  const spouse = ehepartnerName
    ? {
        name: ehepartnerName,
        gueterstand:
          (prunedUserData.gueterstand as Gueterstand | undefined) ??
          "communityOfAcquisitions",
      }
    : undefined;

  const heirShares = calculateInheritance({
    ...(prunedUserData as InheritanceInput),
    spouse,
  });

  const prevStepId = flowSession.prevPath;
  const backDestination = prevStepId
    ? flowId + resolveArrayCharacter(prevStepId, arrayIndexes, false)
    : undefined;

  return data({
    cmsContent,
    heirShares,
    buttonNavigationProps: getButtonNavigationProps({
      backButtonLabel: cmsContent?.backButtonLabel ?? "Zurück",
      nextButtonLabel: cmsContent?.nextLink?.text ?? "Weiter",
      backDestination,
    }),
  });
};

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
      FIRST_ORDER_LABELS[heir.depth - 1] ??
      `Abkömmling (${heir.depth}. Grad)`
    );
  }
  return SECOND_ORDER_LABELS[heir.depth] ?? `Verwandter (${heir.depth}. Grad)`;
}

function shareLabel({ numerator, denominator }: HeirShare["share"]): string {
  if (numerator === denominator) return "das gesamte Erbe";
  return `${numerator}/${denominator} des Erbes`;
}

function ErbfolgeResultPage() {
  const {
    cmsContent,
    heirShares,
    buttonNavigationProps: { back, next },
  } = useLoaderData<typeof loader>();

  const content = cmsContent?.freeZone ?? [];
  const documentsList = cmsContent?.documents ?? [];
  const nextSteps = cmsContent?.nextSteps ?? [];

  return (
    <>
      <GridSection className="print:hidden" pt="40" pb="24">
        <Grid
          rows={2}
          background={{
            mdColumn: { start: 1, span: 8 },
            lgColumn: { start: 2, span: 10 },
            xlColumn: { start: 2, span: 10 },
            className: "rounded-lg kern-alert--success border-2 border-kern-alert--success",
          }}
        >
          <GridItem
            mdColumn={{ start: 1, span: 8 }}
            lgColumn={{ start: 3, span: 8 }}
            xlColumn={{ start: 3, span: 8 }}
            className="pt-32 pb-40 py-24 px-16 md:px-16 lg:px-0 xl:px-0"
            row={1}
          >
            <div className="flex sm:flex-row flex-col gap-16" id="flow-page-content">
              {cmsContent ? (
                <>
                  <Heading
                    tagName={cmsContent.heading.tagName}
                    text={cmsContent.heading.text}
                    className="kern-heading-large p-0!"
                    managedByParent
                  />
                  {cmsContent.hintText && (
                    <RichText
                      className="font-medium! text-kern-static-large!"
                      html={cmsContent.hintText.html}
                    />
                  )}
                </>
              ) : (
                <Heading
                  tagName="h1"
                  text="Erbfolge"
                  className="kern-heading-large p-0!"
                  managedByParent
                />
              )}
            </div>
          </GridItem>
          <GridItem
            mdColumn={{ start: 1, span: 8 }}
            lgColumn={{ start: 2, span: 12 }}
            xlColumn={{ start: 2, span: 12 }}
            className="py-24"
            row={2}
          >
            <ButtonContainer>
              {back.destination && (
                <a
                  className="kern-link text-kern-static-small! no-underline! hover:underline!"
                  href={back.destination}
                >
                  <Icon name="arrow-back" />
                  {back.label}
                </a>
              )}
              {cmsContent?.nextLink?.url && (
                <a
                  className="kern-link text-kern-static-small! no-underline! hover:underline!"
                  href={cmsContent.nextLink.url}
                >
                  <Icon name="keyboard-double-arrow-left" />
                  {next?.label}
                </a>
              )}
            </ButtonContainer>
          </GridItem>
        </Grid>
      </GridSection>

      <GridSection pt="32" pb="40">
        <Grid>
          <GridItem
            mdColumn={{ start: 1, span: 8 }}
            lgColumn={{ start: 2, span: 10 }}
            xlColumn={{ start: 2, span: 10 }}
          >
            {heirShares.length === 0 ? (
              <p className="kern-label">
                Auf Basis Ihrer Angaben konnten keine Erben ermittelt werden.
              </p>
            ) : (
              <ul className="flex flex-col gap-16 list-none p-0">
                {heirShares.map((heir) => (
                  <li
                    key={heir.name}
                    className="kern-summary kern-summary--border p-24 rounded-lg"
                  >
                    <div className="flex flex-col gap-4">
                      <span className="kern-label-small text-kern-static-tertiary">
                        {relationshipLabel(heir)}
                      </span>
                      <span className="kern-label font-semibold">{heir.name}</span>
                      <span className="kern-label">
                        erbt {shareLabel(heir.share)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </GridItem>
        </Grid>
      </GridSection>

      {content.length > 0 && <ContentComponents content={content} />}

      {documentsList.length > 0 &&
        documentsList.map((element) => (
          <ContentComponents
            key={`${element.__component}_${element.id}`}
            content={[element]}
          />
        ))}
      <ContentComponents content={nextSteps} />
    </>
  );
}

export default ErbfolgeResultPage;
