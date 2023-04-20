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

type ResultPageProps = {
  content: ResultPageContent;
  reasonsToDisplay?: ElementWithId[];
  backDestination?: string;
};

type PageTypeProperties = {
  background: string;
  icon: (className: string) => ReactElement;
};

const pageTypeProperties = (pageType: ResultPageType): PageTypeProperties => {
  const pageTypePropertyMap = {
    error: {
      background: "bg-red-200",
      icon: (className) => <HighlightOff color="error" className={className} />,
    },
    success: {
      background: "bg-green-200",
      icon: (className) => (
        <CheckCircleOutline color="success" className={className} />
      ),
    },
    warning: {
      background: "bg-yellow-200",
      icon: (className) => (
        <WarningAmber color="warning" className={className} />
      ),
    },
  } as { [key in ResultPageType]: PageTypeProperties };
  return pageTypePropertyMap[pageType];
};

const ResultPage = ({
  content,
  backDestination,
  reasonsToDisplay,
}: ResultPageProps) => {
  const pageProperties = pageTypeProperties(content.pageType);
  return (
    <div>
      <div className={pageProperties.background}>
        <Container>
          <div>
            <p className="ds-label-03-reg mb-4">Vorab-Check</p>
            <ProgressBar progress={1} max={1} fallback={"Letzter Schritt"} />
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
          {/* TODO: Replace this with the correct component */}
          {content.hintText && (
            <div className="bg-white p-32 mt-48">
              <p className="ds-label-02-bold mb-8">Hinweis</p>
              <RichText markdown={content.hintText.text} />
            </div>
          )}
          {content.linkText && (
            <a href={"/vorabcheck"} className="block ds-link-02-bold mt-32">
              {content.linkText}
            </a>
          )}
        </Container>
      </div>
      {content.freeZone && content.freeZone.length > 0 && (
        <Container>
          <PageContent content={content.freeZone} />
        </Container>
      )}
      {content.nextLink && (
        <Container>
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

            {content.nextLink.url && (
              <Button
                href={content.nextLink.url}
                size="large"
                className="w-fit"
              >
                {content.nextLink.text}
              </Button>
            )}
            {!content.nextLink.url && (
              <>
                <form method="post">
                  <Button
                    type="submit"
                    name="_action"
                    size="large"
                    className="w-fit"
                  >
                    {content.nextLink.text}
                  </Button>
                </form>
              </>
            )}
          </ButtonContainer>
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
              <div key={reason.attributes.elementId}>
                <PageContent content={reason.attributes.element} />
              </div>
            );
          })}
        </Container>
      )}
    </div>
  );
};
export default ResultPage;
