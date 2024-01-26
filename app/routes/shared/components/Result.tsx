import { type ReactElement } from "react";
import CheckCircleOutline from "@digitalservicebund/icons/CheckCircleOutline";
import HighlightOff from "@digitalservicebund/icons/HighlightOff";
import WarningAmber from "@digitalservicebund/icons/WarningAmber";
import type { StrapiResultPageType } from "~/services/cms/models/StrapiResultPageType";
import { useLoaderData } from "@remix-run/react";
import Container from "~/components/Container";
import Heading from "~/components/Heading";
import PageContent, { keyFromElement } from "~/components/PageContent";
import RichText from "~/components/RichText";
import InfoBox from "~/components/InfoBox";
import UserFeedback from "~/components/UserFeedback";
import { ProgressBar } from "~/components/form/ProgressBar";
import { ButtonNavigation } from "~/components/form/ButtonNavigation";
import ButtonContainer from "~/components/ButtonContainer";
import { infoBoxesFromElementsWithID } from "~/services/cms/models/StrapiInfoBoxItem";
import { dataDeletionKey } from "~/services/flow/constants";
import CourtDetails from "~/components/CourtDetails";
import Background from "~/components/Background";
import type { loader } from "../result.server";

const iconCSS = "inline-block mr-8 !h-[36px] !w-[36px]";
export const icons: Record<StrapiResultPageType, ReactElement> = {
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

export const backgrounds: Record<StrapiResultPageType, string> = {
  error: "bg-red-200",
  success: "bg-green-200",
  warning: "bg-yellow-200",
};

export function Result() {
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
