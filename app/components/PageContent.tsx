import { Input, Select, Stack } from "~/components";
import Heading from "~/components/Heading";
import Paragraph from "~/components/Paragraph";

type PageContentProps = {
  content: any[];
};

const mapping: { [name: string]: any } = {
  "basic.header": Heading,
  "basic.paragraph": Paragraph,
  "basic.input": Input,
  "basic.select": Select,
};

const PageContent = ({ content }: PageContentProps) => {
  return (
    <Stack space="l">
      {content?.map((component: any, index: number) => {
        const Component = mapping[component.__component];
        return <Component key={`${index}`} {...component} />;
      })}
    </Stack>
  );
};

export default PageContent;
