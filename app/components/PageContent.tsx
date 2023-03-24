import { Stack } from "~/components";
import Heading from "~/components/Heading";
import Paragraph from "~/components/Paragraph";
// import InfoBox from "~/components/InfoBox";
import type { ElementContent } from "~/services/cms/getPageConfig";

type PageContentProps = {
  content: Array<ElementContent>;
};

function cmsToReact(element: ElementContent) {
  if (element.__component === "basic.heading") {
    return Heading({ ...element });
  } else if (element.__component === "basic.paragraph") {
    return Paragraph({ ...element });
  }
  return undefined;
}

const PageContent = ({ content }: PageContentProps) => {
  return <Stack space="l">{content.map((el) => cmsToReact(el))}</Stack>;
};

export default PageContent;
