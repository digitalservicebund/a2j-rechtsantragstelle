import type { ResultPage as ResultPageContent } from "~/services/cms/models/ResultPage";
import RichText from "~/components/RichText";
import { HighlightOff } from "@mui/icons-material";
import Container from "~/components/Container";
import { ProgressBar } from "~/components/form/ProgressBar";
import Heading from "~/components/Heading";

type ResultPageProps = {
  content: ResultPageContent;
};

const ResultPage = ({ content }: ResultPageProps) => (
  <div>
    <div className="bg-red-200">
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
              {" "}
              <HighlightOff
                color="error"
                className="inline-block mr-8 !h-[36px] !w-[36px]"
              />
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
export default ResultPage;
