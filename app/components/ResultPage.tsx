import type { ResultPage as ResultPageContent } from "~/services/cms/models/ResultPage";
import RichText from "~/components/RichText";
import {
  CheckCircleOutline,
  HighlightOff,
  WarningAmber,
} from "@mui/icons-material";
import Container from "~/components/Container";
import { ProgressBar } from "~/components/form/ProgressBar";
import Heading from "~/components/Heading";
import type { ResultPageType } from "~/services/cms/models/ResultPage";
import type { ReactElement } from "react";
import PageContent from "~/components/PageContent";
import { Button } from "~/components/index";
import { ButtonContainer } from "~/components/ButtonContainer";
import type { ElementWithId } from "~/services/cms/models/ElementWithId";
import classes from "classnames";

type ResultPageProps = {
  content: ResultPageContent;
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
  reasonsToDisplay,
  stepProgress,
  progressTotal,
  isLast,
}: ResultPageProps) => {
  const pageProperties = pageTypeProperties(content.pageType);
  const documentsList = content.documents.data
    ? content.documents.data.attributes.element
    : [];

  return (
    <div>
      <div className={pageProperties.background}>
        <Container>
          <div>
            <p className="ds-label-03-reg mb-4">Vorab-Check</p>
            <ProgressBar
              progress={stepProgress}
              max={progressTotal}
              fallback={`Schritt ${stepProgress} / ${progressTotal}`}
            />
          </div>
          <Heading
            level={content.heading.level}
            style={content.heading.style}
            className="flex items-center mb-0"
            text={
              <>
                {pageProperties.icon("inline-block mr-8 !h-[36px] !w-[36px]")}
                {content.heading?.text}
              </>
            }
          />
        </Container>

        {content.hintText && (
          <Container backgroundColor="white" paddingTop="32" paddingBottom="40">
            <div className="ds-stack stack-8">
              <p className="ds-label-02-bold">Hinweis</p>
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
      {reasonsToDisplay && reasonsToDisplay.length > 1 && (
        <Container>
          <Heading
            level={2}
            style="ds-heading-02-reg"
            text="Begründung"
            className="mb-16"
          />
          {reasonsToDisplay.map((reason) => {
            return (
              <>
                <PageContent content={reason.attributes.element} />
                <hr className="mt-24" />
              </>
            );
          })}
        </Container>
      )}

      <div className={`${documentsList.length > 0 && "bg-blue-100"}`}>
        <Container>
          {documentsList.map((element) => {
            return (
              <>
                <PageContent content={[element]} />
                <hr className="mt-24" />
              </>
            );
          })}

          <ButtonContainer>
            {backDestination && (
              <Button
                href={backDestination}
                look="tertiary"
                size="large"
                className="w-fit"
              >
                Zurück
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
                  {content.nextLink?.text ?? "Vorab-Check fortsetzen"}
                </Button>
              </form>
            )}
          </ButtonContainer>
        </Container>
      </div>
    </div>
  );
};
export default ResultPage;
