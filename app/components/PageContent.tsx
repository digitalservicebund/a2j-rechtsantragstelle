import { Stack } from "~/components";
import Heading from "~/components/Heading";
import Paragraph from "~/components/Paragraph";
import Header from "./Header";
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
    return Paragraph({ ...element, key });
  } else if (element.__component === "page.header") {
    return Header({ ...element, key });
  }
}

const PageContent = ({ content = [] }: PageContentProps) => (
  <Stack space="l"> {content.map((el, idx) => cmsToReact(el, idx))}</Stack>
);
export default PageContent;
