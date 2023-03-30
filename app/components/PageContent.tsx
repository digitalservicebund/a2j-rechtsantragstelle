import { Stack } from "~/components";
import Heading from "~/components/Heading";
import Paragraph from "~/components/Paragraph";
// import InfoBox from "~/components/InfoBox";
import type { ElementContent } from "~/services/cms/getPageConfig";

type PageContentProps = {
  content: Array<ElementContent>;
};

function cmsToReact(element: ElementContent, key?: string | number) {
  if (element.__component === "basic.heading") {
    return Heading({ ...element, key });
  } else if (element.__component === "basic.paragraph") {
    return Paragraph({ ...element, key });
  }
  return undefined;
}

const PageContent = ({ content = [] }: PageContentProps) => (
  <Stack space="l">{content.map((el, idx) => cmsToReact(el, idx))}</Stack>
);

export default PageContent;
