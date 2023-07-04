import type { ReactElement } from "react";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import HighlightOff from "@mui/icons-material/HighlightOff";
import WarningAmber from "@mui/icons-material/WarningAmber";
import type { StrapiElementWithId } from "~/services/cms/models/StrapiElementWithId";
import type { StrapiResultPage } from "~/services/cms/models/StrapiResultPage";
import type { StrapiResultPageType } from "~/services/cms/models/StrapiResultPageType";
import type { StrapiVorabCheckCommon } from "~/services/cms/models/StrapiVorabCheckCommon";
import Container from "~/components/Container";
import Heading from "~/components/Heading";
import PageContent, { keyFromElement } from "~/components/PageContent";
import { ProgressBar } from "./form/ProgressBar";
import RichText from "~/components/RichText";
import InfoBox from "~/components/InfoBox";
import invariant from "tiny-invariant";
import { getInfoBoxItemProps } from "~/services/props/getInfoBoxItemProps";
import type { InfoBoxItemProps } from "~/components/InfoBoxItem";
import { ButtonNavigation } from "./form/ButtonNavigation";

type ResultPageProps = {
  content: StrapiResultPage;
  common: StrapiVorabCheckCommon;
  reasonsToDisplay?: StrapiElementWithId[];
  backDestination?: string;
  progressStep: number;
  progressTotal: number;
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

const ResultPage = ({
  content,
  common,
  backDestination,
  reasonsToDisplay = [],
  progressStep,
  progressTotal,
}: ResultPageProps) => {
  const documentsList = content.documents.data?.attributes.element ?? [];
  const nextSteps = content.nextSteps.data?.attributes.element ?? [];

  const infoBoxItems: InfoBoxItemProps[] = [];
  reasonsToDisplay.forEach((reason) => {
    reason.element.forEach((element) => {
      invariant(
        element.__component == "page.info-box-item",
        "Reason to Display has to be an InfoBoxItem"
      );
      infoBoxItems.push(getInfoBoxItemProps(element));
    });
  });

  return (
    <div>
      <div className={backgrounds[content.pageType]}>
        <Container paddingTop="24">
          <ProgressBar
            label={common.progressBarLabel}
            progress={progressStep}
            max={progressTotal}
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
              href={"/beratungshilfe/vorabcheck"}
              className="block ds-link-02-bold"
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
      {reasonsToDisplay.length > 0 && (
        <Container>
          <InfoBox
            heading={{
              tagName: "h2",
              look: "ds-heading-02-reg",
              text: "Begründung",
              className: "mb-16",
            }}
            items={infoBoxItems}
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
          <ButtonNavigation
            back={{
              destination: backDestination,
              label: common.backButtonDefaultLabel,
            }}
            next={{
              destination: content.nextLink?.url ?? undefined,
              label: content.nextLink?.text ?? undefined,
            }}
          />
        </Container>
        <div className="pb-48">
          <PageContent content={nextSteps} />
        </div>
      </div>
    </div>
  );
};
export default ResultPage;
