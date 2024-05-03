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
import UserFeedback from "~/components/UserFeedback";
import type { BannerState } from "~/components/UserFeedback";
import ButtonContainer from "~/components/ButtonContainer";
import { infoBoxesFromElementsWithID } from "~/services/cms/models/StrapiInfoBoxItem";
import { dataDeletionKey } from "~/services/flow/constants";
import CourtDetails from "~/components/CourtDetails";
import Background from "~/components/Background";
import type { FlowId } from "~/models/flows/contexts";
import type { Translations } from "~/services/cms/index.server";
import type { CollectionSchemas, EntrySchemas } from "~/services/cms/schemas";
import type { z } from "zod";
import type { Jmtd14VTErwerberGerbeh } from "~/services/gerichtsfinder/types";
import type { StrapiElementWithId } from "~/services/cms/models/StrapiElementWithId";
import type { BackgroundColor } from "~/components";

const iconCSS = "inline-block !h-[36px] !w-[36px] !min-h-[36px] !min-w-[36px]";
const icons: Record<StrapiResultPageType, ReactElement> = {
  error: <HighlightOff color="error" className={iconCSS} />,
  success: <CheckCircleOutline color="success" className={iconCSS} />,
  warning: <WarningAmber color="warning" className={iconCSS} />,
};

const backgrounds: Record<StrapiResultPageType, BackgroundColor> = {
  error: "red",
  success: "green",
  warning: "yellow",
};

type Props = {
  readonly flowId: FlowId;
  readonly common: Translations;
  readonly cmsData: z.infer<CollectionSchemas["result-pages"]>;
  readonly reasons: StrapiElementWithId[];
  readonly backButton: {
    label: string;
    destination?: string;
  };
  readonly bannerState: BannerState;
  readonly amtsgerichtCommon: z.infer<EntrySchemas["amtsgericht-common"]>;
  readonly courts: Jmtd14VTErwerberGerbeh[];
};

export function ResultPage({
  flowId,
  common,
  cmsData,
  reasons,
  backButton,
  bannerState,
  amtsgerichtCommon,
  courts,
}: Props) {
  const documentsList = cmsData.documents.data?.attributes.element ?? [];
  const nextSteps = cmsData.nextSteps.data?.attributes.element ?? [];
  const content = cmsData.freeZone;

  return (
    <>
      <Background backgroundColor="blue" paddingTop="40" paddingBottom="48">
        <div className={backgrounds[cmsData.pageType]}>
          <Container
            overhangingBackground
            backgroundColor={backgrounds[cmsData.pageType]}
            paddingTop="32"
            paddingBottom="40"
          >
            <div className="flex sm:flex-row flex-col gap-16">
              {icons[cmsData.pageType]}
              <div className="flex flex-col gap-16">
                <Heading
                  tagName={cmsData.heading.tagName}
                  look={cmsData.heading.look}
                  className="flex items-center mb-0"
                >
                  {cmsData.heading.text}
                </Heading>

                {cmsData.hintText && (
                  <RichText markdown={cmsData.hintText.text} />
                )}
              </div>
            </div>
          </Container>

          {reasons.length > 0 && (
            <Container paddingBottom="0">
              <InfoBox items={infoBoxesFromElementsWithID(reasons)} />
            </Container>
          )}

          <Container paddingTop="48" paddingBottom="0">
            <ButtonContainer>
              <a className="text-link" href={backButton.destination}>
                {backButton.label}
              </a>
              {cmsData.linkText && (
                <a
                  className="text-link"
                  href={`/beratungshilfe/vorabcheck?${dataDeletionKey}`}
                >
                  {cmsData.linkText}
                </a>
              )}
              {cmsData.nextLink?.url && (
                <a className="text-link" href={cmsData.nextLink.url}>
                  {cmsData.nextLink.text ?? common["nextButtonDefaultLabel"]}
                </a>
              )}
            </ButtonContainer>
          </Container>
        </div>
      </Background>

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
