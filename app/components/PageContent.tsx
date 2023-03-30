import { Stack } from "~/components";
import Heading from "~/components/Heading";
import Paragraph from "~/components/Paragraph";
// import InfoBox from "~/components/InfoBox";
import type { FormContentCMS } from "~/services/cms/models/contentComponents";

type PageContentProps = {
  content: Array<FormContentCMS>;
};

function cmsToReact(element: FormContentCMS, key?: string | number) {
  if (element.__component === "basic.heading") {
    return Heading({ ...element, key });
  } else if (element.__component === "basic.paragraph") {
    return Paragraph({ ...element, key });
  }
}

const PageContent = ({ content = [] }: PageContentProps) => (
  <Stack space="l">{content.map((el, idx) => cmsToReact(el, idx))}</Stack>
);
export default PageContent;
