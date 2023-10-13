import { useLoaderData } from "@remix-run/react";
import type { ActionFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { getSessionForContext } from "~/services/session";
import {
  fetchCollectionEntry,
  fetchMeta,
  fetchSingleEntry,
} from "~/services/cms/index.server";
import { buildFlowController } from "~/services/flow/buildFlowController";
import { getReasonsToDisplay } from "~/models/flows/common";
import {
  flowIDFromPathname,
  flowSpecifics,
  splatFromParams,
} from "./flowSpecifics";
import type { ReactElement } from "react";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import HighlightOff from "@mui/icons-material/HighlightOff";
import WarningAmber from "@mui/icons-material/WarningAmber";
import type { StrapiResultPageType } from "~/services/cms/models/StrapiResultPageType";
import Container from "~/components/Container";
import Heading from "~/components/Heading";
import PageContent, { keyFromElement } from "~/components/PageContent";
import RichText from "~/components/RichText";
import InfoBox from "~/components/InfoBox";
import { ProgressBar } from "~/components/form/ProgressBar";
import { ButtonNavigation } from "~/components/form/ButtonNavigation";
import Button from "~/components/Button";
import ButtonContainer from "~/components/ButtonContainer";
import { throw404IfFeatureFlagEnabled } from "~/services/errorPages/throw404";
import { infoBoxesFromElementsWithID } from "~/services/cms/models/StrapiInfoBoxItem";

export const loader = async ({
  params,
  request,
  context,
}: LoaderFunctionArgs) => {
  await throw404IfFeatureFlagEnabled(request);
  const { pathname } = new URL(request.url);
  const flowId = flowIDFromPathname(pathname);
  const stepId = "ergebnis/" + splatFromParams(params);
  const cookieId = request.headers.get("Cookie");
  const { data, id } = await getSessionForContext(flowId).getSession(cookieId);
  context.sessionId = getSessionForContext(flowId).getSessionId(id); // For showing in errors
  const { flow, guards } = flowSpecifics[flowId];
  const flowController = buildFlowController({ flow, data, guards });

  if (!flowController.isReachable(stepId))
    return redirect(flowController.getInitial().url);

  // Slug change to keep Strapi slugs without ergebnis/
  const slug = pathname.replace(/ergebnis\//, "");
  const [common, cmsData, parentMeta] = await Promise.all([
    fetchSingleEntry("vorab-check-common"),
    fetchCollectionEntry("result-pages", slug),
    fetchMeta({ slug: pathname.substring(0, pathname.lastIndexOf("/")) }),
  ]);

  const reasonElementsWithID =
    cmsData.reasonings.data?.map((el) => el.attributes) ?? [];

  const hideNextButton =
    flowController.isFinal(stepId) && cmsData.nextLink?.url === undefined;
  const nextButton = hideNextButton
    ? undefined
    : {
        destination: cmsData.nextLink?.url ?? undefined,
        label: cmsData.nextLink?.text ?? common.nextButtonDefaultLabel,
      };

  return json({
    common,
    cmsData: cmsData,
    content: cmsData.freeZone,
    meta: { ...cmsData.meta, breadcrumbTitle: parentMeta.title },
    reasons: getReasonsToDisplay(reasonElementsWithID, data),
    progress: flowController.getProgress(stepId),
    nextButton,
    backButton: {
      destination: flowController.getPrevious(stepId)?.url,
      label: common.backButtonDefaultLabel,
    },
  });
};

export const action: ActionFunction = async ({ params, request, context }) => {
  const splat = splatFromParams(params);
  const flowId = flowIDFromPathname(new URL(request.url).pathname);
  const cookieId = request.headers.get("Cookie");
  const { data, id } = await getSessionForContext(flowId).getSession(cookieId);
  context.sessionId = getSessionForContext(flowId).getSessionId(id); // For showing in errors
  const { flow, guards } = flowSpecifics[flowId];
  const flowController = buildFlowController({ flow, data, guards });
  return redirect(flowController.getNext("ergebnis/" + splat).url);
};

const iconCSS = "inline-block mr-8 !h-[36px] !w-[36px]";
const icons: Record<StrapiResultPageType, ReactElement> = {
  error: <HighlightOff color="error" className={`${iconCSS} !text-red-900`} />,
  success: (
    <CheckCircleOutline
      color="success"
      className={`${iconCSS} !text-green-900`}
    />
  ),
  warning: (
    <WarningAmber color="warning" className={`${iconCSS} !text-yellow-900`} />
  ),
};

const backgrounds: Record<StrapiResultPageType, string> = {
  error: "bg-red-200",
  success: "bg-green-200",
  warning: "bg-yellow-200",
};

export function Step() {
  const {
    common,
    content,
    cmsData,
    reasons,
    progress,
    nextButton,
    backButton,
  } = useLoaderData<typeof loader>();

  const documentsList = cmsData.documents.data?.attributes.element ?? [];
  const nextSteps = cmsData.nextSteps.data?.attributes.element ?? [];

  return (
    <>
      <div className={backgrounds[cmsData.pageType]}>
        <Container paddingTop="24">
          <ProgressBar
            label={common.progressBarLabel}
            progress={progress.current}
            max={progress.total}
          />
          <Heading
            tagName={cmsData.heading.tagName}
            look={cmsData.heading.look}
            className="flex items-center mb-0"
          >
            {icons[cmsData.pageType]}
            {cmsData.heading.text}
          </Heading>
        </Container>

        {cmsData.hintText && (
          <Container
            backgroundColor="white"
            paddingTop="32"
            paddingBottom="40"
            overhangingBackground={true}
          >
            <div className="ds-stack-8">
              <p className="ds-label-02-bold">{common.resultHintLabel}</p>
              <RichText markdown={cmsData.hintText.text} />
            </div>
          </Container>
        )}

        {(cmsData.linkText || cmsData.backLinkInHeader) && (
          <Container paddingTop="32" paddingBottom="32">
            <ButtonContainer>
              {cmsData.backLinkInHeader && (
                <Button
                  href={backButton.destination}
                  look="tertiary"
                  size="large"
                  className="w-fit"
                >
                  {backButton.label}
                </Button>
              )}
              {cmsData.linkText && (
                <Button
                  look="tertiary"
                  size="large"
                  href="/beratungshilfe/vorabcheck"
                >
                  {cmsData.linkText}
                </Button>
              )}
            </ButtonContainer>
          </Container>
        )}
      </div>
      {content.length > 0 && <PageContent content={content} />}
      {reasons.length > 0 && (
        <Container>
          <InfoBox
            heading={{
              tagName: "h2",
              look: "ds-heading-02-reg",
              text: "Begründung",
              className: "mb-16",
            }}
            items={infoBoxesFromElementsWithID(reasons)}
          />
        </Container>
      )}

      {documentsList.length > 0 && (
        <div>
          {documentsList.map((element, idx) => (
            <div key={keyFromElement(element)}>
              <PageContent content={[element]} />
              {idx != 0 && idx != documentsList.length - 1 && (
                <hr className="my-24" />
              )}
            </div>
          ))}
        </div>
      )}
      <div className={`${documentsList.length > 0 ? "bg-blue-100" : ""}`}>
        {!cmsData.backLinkInHeader && (
          <Container>
            <form method="post">
              <ButtonNavigation back={backButton} next={nextButton} />
            </form>
          </Container>
        )}
        <PageContent content={nextSteps} />
      </div>
    </>
  );
}
