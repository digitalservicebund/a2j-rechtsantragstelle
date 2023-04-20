import type { ResultPage as ResultPageContent } from "~/services/cms/models/ResultPage";
import RichText from "~/components/RichText";

type ResultPageProps = {
  content: ResultPageContent;
};

const ResultPage = ({ content }: ResultPageProps) => (
  <div>
    <h1>{content.heading?.text}</h1>
    <div>Hinweis</div>
    {content.hintText && <RichText markdown={content.hintText.text} />}
  </div>
);
export default ResultPage;
