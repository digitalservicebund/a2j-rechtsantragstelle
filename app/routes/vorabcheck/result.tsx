import { useLoaderData } from "@remix-run/react";
import type {
  ActionFunction,
  LoaderArgs,
  V2_MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { getSessionForContext } from "~/services/session";
import { getStrapiResultPage, getStrapiVorabCheckCommon } from "~/services/cms";
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
import { infoBoxesFromElementsWithID } from "~/services/props/getInfoBoxItemProps";

export const meta: V2_MetaFunction<typeof loader> = ({ data, location }) => [
  { title: data?.meta?.title ?? location.pathname },
];

export const loader = async ({ params, request }: LoaderArgs) => {
  const { pathname } = new URL(request.url);
  const flowId = flowIDFromPathname(pathname);
  const stepId = "ergebnis/" + splatFromParams(params);
  const { data } = await getSessionForContext(flowId).getSession(
    request.headers.get("Cookie"),
  );
  const { flow, guards } = flowSpecifics[flowId];
  const flowController = buildFlowController({ flow, data, guards });

  if (!flowController.isReachable(stepId))
    return redirect(flowController.getInitial().url);

  // Slug change to keep Strapi slugs without ergebnis/
  const slug = pathname.replace(/ergebnis\//, "");
  const common = await getStrapiVorabCheckCommon();
  const content = await getStrapiResultPage({ slug });
  const reasonElementsWithID =
    content.reasonings.data?.map((el) => el.attributes) ?? [];

  const hideNextButton =
    flowController.isFinal(stepId) && content.nextLink?.url === undefined;
  const nextButton = hideNextButton
    ? undefined
    : {
        destination: content.nextLink?.url ?? undefined,
        label: content.nextLink?.text ?? common.nextButtonDefaultLabel,
      };

  return json({
    common,
    content,
    meta: content.meta,
    reasons: getReasonsToDisplay(reasonElementsWithID, data),
    progress: flowController.getProgress(stepId),
    nextButton,
    backButton: {
      destination: flowController.getPrevious(stepId)?.url,
      label: common.backButtonDefaultLabel,
    },
  });
};

export const action: ActionFunction = async ({ params, request }) => {
  const splat = splatFromParams(params);
  const flowId = flowIDFromPathname(new URL(request.url).pathname);
  const { data } = await getSessionForContext(flowId).getSession(
    request.headers.get("Cookie"),
  );
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
  const { common, content, reasons, progress, nextButton, backButton } =
    useLoaderData<typeof loader>();

  const documentsList = content.documents.data?.attributes.element ?? [];
  const nextSteps = content.nextSteps.data?.attributes.element ?? [];

  return (
    <>
      <div className={backgrounds[content.pageType]}>
        <Container paddingTop="24">
          <ProgressBar
            label={common.progressBarLabel}
            progress={progress.current}
            max={progress.total}
          />
          <Heading
            tagName={content.heading.tagName}
            look={content.heading.look}
            className="flex items-center mb-0"
          >
            {icons[content.pageType]}
            {content.heading.text}
          </Heading>
        </Container>

        {content.hintText && (
          <Container
            backgroundColor="white"
            paddingTop="32"
            paddingBottom="40"
            overhangingBackground={true}
          >
            <div className="ds-stack-8">
              <p className="ds-label-02-bold">{common.resultHintLabel}</p>
              <RichText markdown={content.hintText.text} />
            </div>
          </Container>
        )}

        {content.linkText && (
          <Container paddingTop="32" paddingBottom="32">
            <a
              href="/beratungshilfe/vorabcheck"
              className="text-link text-base increase-tap-area"
            >
              {content.linkText}
            </a>
          </Container>
        )}
      </div>
      {content.freeZone.length > 0 && (
        <Container>
          <PageContent content={content.freeZone} />
        </Container>
      )}
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
      <div className={`${documentsList.length > 0 && "bg-blue-100"}`}>
        <Container>
          <form method="post">
            <ButtonNavigation back={backButton} next={nextButton} />
          </form>
        </Container>
        <div className="pb-48">
          <PageContent content={nextSteps} />
        </div>
      </div>
    </>
  );
}
