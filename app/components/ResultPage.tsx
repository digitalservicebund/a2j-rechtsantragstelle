import type { ReactElement } from "react";
import classes from "classnames";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import HighlightOff from "@mui/icons-material/HighlightOff";
import WarningAmber from "@mui/icons-material/WarningAmber";
import type { StrapiElementWithId } from "~/services/cms/models/StrapiElementWithId";
import type { StrapiResultPage } from "~/services/cms/models/StrapiResultPage";
import type { StrapiResultPageType } from "~/services/cms/models/StrapiResultPageType";
import type { StrapiVorabCheckCommon } from "~/services/cms/models/StrapiVorabCheckCommon";
import Button from "~/components/Button";
import ButtonContainer from "~/components/ButtonContainer";
import Container from "~/components/Container";
import Heading from "~/components/Heading";
import PageContent, { keyFromElement } from "~/components/PageContent";
import ProgressBarArea from "~/components/form/ProgressBarArea";
import RichText from "~/components/RichText";
import InfoBox from "~/components/InfoBox";
import invariant from "tiny-invariant";
import { getInfoBoxItemProps } from "~/services/props/getInfoBoxItemProps";
import type { StrapiInfoBoxItem } from "~/services/cms/models/StrapiInfoBoxItem";
import type { InfoBoxItemProps } from "~/components/InfoBoxItem";

type ResultPageProps = {
  content: StrapiResultPage & StrapiVorabCheckCommon;
  reasonsToDisplay?: StrapiElementWithId[];
  backDestination?: string;
  progressStep: number;
  progressTotal: number;
  isLast: boolean;
};

type PageTypeProperties = {
  background: string;
  icon: (className: string) => ReactElement;
};

const pageTypeProperties = (
  pageType: StrapiResultPageType
): PageTypeProperties => {
  const pageTypePropertyMap = {
    error: {
      background: "bg-red-200",
      icon: (className) => (
        <HighlightOff
          color="error"
          className={classes(className, "!text-red-900")}
        />
      ),
    },
    success: {
      background: "bg-green-200",
      icon: (className) => (
        <CheckCircleOutline
          color="success"
          className={classes(className, "!text-green-900")}
        />
      ),
    },
    warning: {
      background: "bg-yellow-200",
      icon: (className) => (
        <WarningAmber
          color="warning"
          className={classes(className, "!text-yellow-900")}
        />
      ),
    },
  } as { [key in StrapiResultPageType]: PageTypeProperties };
  return pageTypePropertyMap[pageType];
};

const ResultPage = ({
  content,
  backDestination,
  reasonsToDisplay = [],
  progressStep,
  progressTotal,
  isLast,
}: ResultPageProps) => {
  const pageProperties = pageTypeProperties(content.pageType);
  const documentsList = content.documents.data
    ? content.documents.data.attributes.element
    : [];
  const nextSteps = content.nextSteps.data
    ? content.nextSteps.data.attributes.element
    : [];

  let infoBoxItems: InfoBoxItemProps[] = [];
  reasonsToDisplay?.forEach((reason) => {
    reason.element.forEach((element) => {
      invariant(
        element.__component == "page.info-box-item",
        "Reason to Display has to be an InfoBoxItem"
      );
      infoBoxItems.push(getInfoBoxItemProps(element as StrapiInfoBoxItem));
    });
  });

  return (
    <div>
      <div className={pageProperties.background}>
        <Container>
          <ProgressBarArea
            label={content.progressBarLabel}
            progressStep={progressStep}
            progressTotal={progressTotal}
          />
          <Heading
            tagName={content.heading.tagName}
            look={content.heading.look}
            className="flex items-center mb-0"
          >
            {pageProperties.icon("inline-block mr-8 !h-[36px] !w-[36px]")}
            {content.heading?.text}
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
              <p className="ds-label-02-bold">{content.resultHintLabel}</p>
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
      {content.freeZone && content.freeZone.length > 0 && (
        <Container>
          <PageContent content={content.freeZone} />
        </Container>
      )}
      {reasonsToDisplay?.length > 0 && (
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
          <ButtonContainer>
            {backDestination && (
              <Button
                href={backDestination}
                look="tertiary"
                size="large"
                className="w-fit"
              >
                {content.backButtonDefaultLabel}
              </Button>
            )}

            {(!isLast || content.nextLink?.url) && (
              <form method="post">
                <Button
                  type={content.nextLink?.url ? undefined : "submit"}
                  name={content.nextLink?.url ? undefined : "_action"}
                  href={
                    content.nextLink?.url ? content.nextLink?.url : undefined
                  }
                  size="large"
                  className="w-fit"
                >
                  {content.nextLink?.text ?? content.nextButtonDefaultLabel}
                </Button>
              </form>
            )}
          </ButtonContainer>
        </Container>
        <div className="pb-48">
          <PageContent content={nextSteps} />
        </div>
      </div>
    </div>
  );
};
export default ResultPage;
