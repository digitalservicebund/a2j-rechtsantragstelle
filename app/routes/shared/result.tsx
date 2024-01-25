import { useLoaderData } from "@remix-run/react";
import type { ActionFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { getSessionForContext } from "~/services/session.server";
import {
  fetchCollectionEntry,
  fetchMeta,
  fetchSingleEntry,
} from "~/services/cms/index.server";
import { buildFlowController } from "~/services/flow/server/buildFlowController";
import { getReasonsToDisplay } from "~/models/flows/common";
import {
  flowIDFromPathname,
  flowSpecifics,
  splatFromParams,
} from "./flowSpecifics";
import { type ReactElement } from "react";
import CheckCircleOutline from "@digitalservicebund/icons/CheckCircleOutline";
import HighlightOff from "@digitalservicebund/icons/HighlightOff";
import WarningAmber from "@digitalservicebund/icons/WarningAmber";
import type { StrapiResultPageType } from "~/services/cms/models/StrapiResultPageType";
import Container from "~/components/Container";
import Heading from "~/components/Heading";
import PageContent, { keyFromElement } from "~/components/PageContent";
import RichText from "~/components/RichText";
import InfoBox from "~/components/InfoBox";
import UserFeedback, { BannerState } from "~/components/UserFeedback";
import { ProgressBar } from "~/components/form/ProgressBar";
import { ButtonNavigation } from "~/components/form/ButtonNavigation";
import ButtonContainer from "~/components/ButtonContainer";
import { throw404IfFeatureFlagEnabled } from "~/services/errorPages/throw404";
import { infoBoxesFromElementsWithID } from "~/services/cms/models/StrapiInfoBoxItem";
import { dataDeletionKey, lastStepKey } from "~/services/flow/constants";
import {
  getFeedbackBannerState,
  handleFeedback,
  isFeedbackForm,
} from "~/services/feedback/handleFeedback";
import CourtDetails from "~/components/CourtDetails";
import {
  isPartnerAirport,
  partnerCourtAirports,
} from "~/models/flows/fluggastrechte";
import Background from "~/components/Background";
import { findCourt } from "~/services/gerichtsfinder/amtsgerichtData.server";

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
  const [common, cmsData, parentMeta, amtsgerichtCommon] = await Promise.all([
    fetchSingleEntry("vorab-check-common"),
    fetchCollectionEntry("result-pages", slug),
    fetchMeta({
      filterValue: pathname.substring(0, pathname.lastIndexOf("/")),
    }),
    fetchSingleEntry("amtsgericht-common"),
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

  const { getSession, commitSession } = getSessionForContext("main");
  const session = await getSession(cookieId);
  session.set(lastStepKey, { [flowId]: stepId });

  return json(
    {
      flowId,
      common,
      cmsData: cmsData,
      content: cmsData.freeZone,
      meta: { ...cmsData.meta, breadcrumbTitle: parentMeta?.title ?? "" },
      reasons: reasonElementsWithID.filter((reason) =>
        Boolean(getReasonsToDisplay(data)[reason.elementId]),
      ),
      progress: flowController.getProgress(stepId),
      nextButton,
      backButton: {
        destination: flowController.getPrevious(stepId)?.url,
        label: common.backButtonDefaultLabel,
      },
      bannerState:
        getFeedbackBannerState(session, pathname) ?? BannerState.ShowRating,
      amtsgerichtCommon,
      courts:
        cmsData.pageType === "success" &&
        [data.startAirport, data.endAirport]
          .filter(isPartnerAirport)
          .map((airport) =>
            findCourt({ zipCode: partnerCourtAirports[airport] }),
          ),
    },
    { headers: { "Set-Cookie": await commitSession(session) } },
  );
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  if (isFeedbackForm(formData)) return handleFeedback(formData, request);
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
    flowId,
    common,
    content,
    cmsData,
    reasons,
    progress,
    nextButton,
    backButton,
    bannerState,
    amtsgerichtCommon,
    courts,
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
        <Container paddingTop="16" paddingBottom="16">
          {(cmsData.linkText || cmsData.backLinkInHeader) && (
            <ButtonContainer>
              {cmsData.backLinkInHeader && (
                <a className="text-link" href={backButton.destination}>
                  {backButton.label}
                </a>
              )}
              {cmsData.linkText && (
                <a
                  className="text-link"
                  href={`/beratungshilfe/vorabcheck?${dataDeletionKey}`}
                >
                  {cmsData.linkText}
                </a>
              )}
            </ButtonContainer>
          )}
        </Container>
      </div>

      {courts && courts.length > 0 && (
        <>
          {courts.length > 1 && (
            <Background backgroundColor="blue">
              <Container
                backgroundColor="blue"
                overhangingBackground
                paddingBottom="0"
              >
                {/* TODO: Move to CMS */}
                Wir haben für Sie mehrere passende Amtsgerichte gefunden. Sie
                können entscheiden, bei welchem Gericht sie eine Klage
                einreichen möchten.
              </Container>
            </Background>
          )}

          {courts.map((court) => (
            <div key={court.BEZEICHNUNG}>
              <Background
                backgroundColor="blue"
                paddingBottom="48"
                paddingTop="40"
              >
                <Container backgroundColor="white" overhangingBackground>
                  <CourtDetails
                    name={court.BEZEICHNUNG}
                    street={court.STR_HNR}
                    city={`${court.PLZ_ZUSTELLBEZIRK} ${court.ORT}`}
                    website={court.URL1}
                    phone={court.TEL}
                    addressLabel={amtsgerichtCommon.resultAddress}
                    websiteLabel={amtsgerichtCommon.resultWebsite}
                    phoneLabel={amtsgerichtCommon.resultPhone}
                  />
                </Container>
              </Background>
            </div>
          ))}
        </>
      )}

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

        <UserFeedback
          bannerState={bannerState}
          rating={{
            heading: "Hat Ihnen der Vorab-Check geholfen?",
            yesButtonLabel: "Ja",
            noButtonLabel: "Nein",
            context: flowId,
          }}
          feedback={{
            heading: "Was können wir verbessern?",
            placeholder: "Bitte tragen Sie keine persönlichen Daten ein!",
            abortButtonLabel: "Abbrechen",
            submitButtonLabel: "Abschicken",
          }}
          postSubmission={{
            heading: "Vielen Dank!",
            text: "Ihr Feedback hilft uns, diese Seite für alle Nutzenden zu verbessern!",
          }}
        />

        <PageContent content={nextSteps} />
      </div>
    </>
  );
}
