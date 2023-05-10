import type { ResultPage as ResultPageContent } from "~/services/cms/models/ResultPage";
import RichText from "~/components/RichText";
import {
  CheckCircleOutline,
  HighlightOff,
  WarningAmber,
} from "@mui/icons-material";
import Container from "~/components/Container";
import Heading from "~/components/Heading";
import type { ResultPageType } from "~/services/cms/models/ResultPage";
import type { ReactElement } from "react";
import PageContent from "~/components/PageContent";
import { Button } from "~/components/index";
import { ButtonContainer } from "~/components/ButtonContainer";
import type { ElementWithId } from "~/services/cms/models/ElementWithId";
import classes from "classnames";
import ProgressBarArea from "~/components/form/ProgressBarArea";
import type { VorabCheckCommons } from "~/services/cms/models/commons/VorabCheckCommons";

type ResultPageProps = {
  content: ResultPageContent & VorabCheckCommons;
  reasonsToDisplay?: ElementWithId[];
  backDestination?: string;
  stepProgress: number;
  progressTotal: number;
  isLast: boolean;
};

type PageTypeProperties = {
  background: string;
  icon: (className: string) => ReactElement;
};

const pageTypeProperties = (pageType: ResultPageType): PageTypeProperties => {
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
  } as { [key in ResultPageType]: PageTypeProperties };
  return pageTypePropertyMap[pageType];
};

const ResultPage = ({
  content,
  backDestination,
  reasonsToDisplay = [],
  stepProgress,
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

  return (
    <div>
      <div className={pageProperties.background}>
        <Container>
          <ProgressBarArea
            label={content.progressBarLabel}
            stepProgress={stepProgress}
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
          <Container backgroundColor="white" paddingTop="32" paddingBottom="40">
            <div className="ds-stack-8">
              <p className="ds-label-02-bold">{content.resultHintLabel}</p>
              <RichText markdown={content.hintText.text} />
            </div>
          </Container>
        )}

        {content.linkText && (
          <Container paddingTop="32" paddingBottom="32">
            <a href={"/vorabcheck"} className="block ds-link-02-bold">
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
      {reasonsToDisplay.length > 0 && (
        <Container>
          <Heading
            tagName="h2"
            look="ds-heading-02-reg"
            text="Begründung"
            className="mb-16"
          />
          {reasonsToDisplay.map((reason, idx) => (
            <div key={idx}>
              <PageContent content={reason.element} />
              {idx < reasonsToDisplay.length - 1 && <hr className="my-24" />}
            </div>
          ))}
        </Container>
      )}

      {documentsList.length > 0 && (
        <div>
          {documentsList.map((element, idx) => (
            <div key={idx}>
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
                  href={content.nextLink?.url}
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
