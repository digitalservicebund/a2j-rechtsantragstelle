import { Stack } from "~/components";
import Heading from "~/components/Heading";
import Paragraph from "~/components/Paragraph";
import InfoBox from "~/components/InfoBox";
import Input from "~/components/Input";

type PageContentProps = {
  content: any[];
};

const EmptyComponent = () => <></>;

const mapping: { [name: string]: any } = {
  "basic.heading": Heading,
  "basic.paragraph": Paragraph,
  "page.info-box": InfoBox,
  "form-elements.input": Input,
};

const PageContent = ({ content }: PageContentProps) => {
  return (
    <Stack space="l">
      {content?.map((component: any, index: number) => {
        const Component = mapping[component.__component] || EmptyComponent;
        return <Component key={`${index}`} {...component} />;
      })}
    </Stack>
  );
};

export default PageContent;
