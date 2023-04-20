import Heading from "~/components/Heading";
import Paragraph from "~/components/Paragraph";
import Header from "./Header";
import InfoBox from "./InfoBox";
import type { FormContentCMS } from "~/services/cms/models/contentComponents";
import type { PageComponentCMS } from "~/services/cms/models/pageComponents";

type PageContentProps = {
  content: Array<FormContentCMS | PageComponentCMS>;
};

function cmsToReact(
  element: FormContentCMS | PageComponentCMS,
  key?: string | number
) {
  if (element.__component === "basic.heading") {
    return Heading({ ...element, key });
  } else if (element.__component === "basic.paragraph") {
    return Paragraph({ ...element, key, className: "ds-body-01-reg" });
  } else if (element.__component === "page.header") {
    return Header({ ...element, key });
  } else if (element.__component === "page.info-box") {
    return InfoBox({ ...element, key });
  } else if (element.__component === "basic.text-with-heading") {
    return (
      <div>
        <Heading {...element.heading} />
        <Paragraph text={element.text} />
      </div>
    );
  }
}

const PageContent = ({ content = [] }: PageContentProps) => (
  <div className="ds-stack stack-24">
    {content.map((el, idx) => cmsToReact(el, idx))}
  </div>
);
export default PageContent;
