import Heading from "~/components/Heading";
import Paragraph from "~/components/Paragraph";
import Header from "./Header";
import InfoBox from "./InfoBox";
import type { FormContentCMS } from "~/services/cms/models/contentComponents";
import type { PageComponentCMS } from "~/services/cms/models/pageComponents";
import type {
  Container as ContainerCMS,
  Background as BackgroundCMS,
} from "~/services/cms/models/metaComponents";
import Box from "./Box";
import type { ContainerProps } from "./Container";
import Container from "./Container";
import type { BackgroundProps } from "./Background";
import Background from "./Background";
import type { ReactNode } from "react";

type PageContentProps = {
  content: Array<FormContentCMS | PageComponentCMS>;
};

const transformCmsData = (
  cmsData: ContainerCMS | BackgroundCMS
): ContainerProps | BackgroundProps => {
  console.log({ cmsData });
  return {
    ...cmsData,
    //@ts-ignore
    paddingTop: cmsData.paddingTop.replace(/^px/, ""),
    //@ts-ignore
    paddingBottom: cmsData.paddingBottom.replace(/^px/, ""),
  };
};

const wrapInContainer = (
  cmsData: { [key: string]: any; container?: ContainerCMS },
  reactElement: ReactNode
): ReactNode => {
  if (!cmsData.container) {
    return reactElement;
  }
  const config = transformCmsData(cmsData.container);
  console.log({ config });
  return <Container {...config}>{reactElement}</Container>;
};

const wrapInBackground = (
  cmsData: { [key: string]: any; background?: BackgroundCMS },
  reactElement: ReactNode
): ReactNode => {
  if (!cmsData.background) {
    return reactElement;
  }
  const config = transformCmsData(cmsData.background);
  return <Background {...config}>{reactElement}</Background>;
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
    return <Header {...element} key={element.id} />;
  } else if (element.__component === "page.info-box") {
    return <InfoBox {...element} key={element.id} />;
  } else if (element.__component === "page.box") {
    return <Box {...element} key={element.id} />;
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
  <div>
    {content.map((el, idx) =>
      wrapInBackground(el, wrapInContainer(el, cmsToReact(el, idx)))
    )}
  </div>
);

export default PageContent;
