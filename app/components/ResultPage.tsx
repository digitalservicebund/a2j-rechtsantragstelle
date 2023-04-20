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

type ResultPageProps = {
  content: ResultPageContent;
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

const ResultPage = ({ content }: ResultPageProps) => {
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
            className="flex items-center mb-48"
            text={
              <>
                {pageProperties.icon("inline-block mr-8 !h-[36px] !w-[36px]")}
                {content.heading?.text}
              </>
            }
          />
          {/* TODO: Replace this with the correct component */}
          {content.hintText && (
            <div className="bg-white p-32">
              <p className="ds-label-02-bold mb-8">Hinweis</p>
              <RichText markdown={content.hintText.text} />
            </div>
          )}
          <a href={"/vorabcheck"} className="ds-link-02-bold mt-32">
            {content.linkText}
          </a>
        </Container>
      </div>
    </div>
  );
};
export default ResultPage;
