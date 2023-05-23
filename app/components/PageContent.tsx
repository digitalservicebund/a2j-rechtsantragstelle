import Heading from "~/components/Heading";
import Paragraph from "~/components/Paragraph";
import Header from "./Header";
import InfoBox from "./InfoBox";
import type { FormContentCMS } from "~/services/cms/models/contentComponents";
import type { PageComponentCMS } from "~/services/cms/models/pageComponents";
import type { Button as ButtonCMS } from "~/services/cms/models/Button";
import type {
  Container as ContainerCMS,
  Background as BackgroundCMS,
} from "~/services/cms/models/metaComponents";
import Box from "./Box";
import type { ContainerProps } from "./Container";
import Container from "./Container";
import type { BackgroundProps } from "./Background";
import Background from "./Background";
import type { ReactElement } from "react";
import Button from "./Button";

type PageContentProps = {
  content: Array<FormContentCMS | PageComponentCMS>;
  className?: string;
};

const transformCmsData = (
  cmsData: ContainerCMS | BackgroundCMS
): ContainerProps | BackgroundProps => {
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
  reactElement: ReactElement
): ReactElement => {
  if (!cmsData.container) {
    return reactElement;
  }
  const isBox = reactElement.props.__component === "page.box";
  const config = transformCmsData(cmsData.container);
  return (
    <Container {...config} overhangingBackground={isBox}>
      {reactElement}
    </Container>
  );
};

const wrapInBackground = (
  cmsData: { [key: string]: any; outerBackground?: BackgroundCMS },
  reactElement: ReactElement
): ReactElement => {
  if (!cmsData.outerBackground) {
    return reactElement;
  }
  const config = transformCmsData(cmsData.outerBackground);
  return <Background {...config}>{reactElement}</Background>;
};

function cmsToReact(
  element: FormContentCMS | PageComponentCMS | ButtonCMS,
  key?: string | number
) {
  if (element.__component === "basic.heading") {
    return <Heading {...element} key={element.id} />;
  } else if (element.__component === "basic.paragraph") {
    return Paragraph({ ...element, key, className: "ds-body-01-reg" });
  } else if (element.__component === "page.header") {
    return <Header {...element} key={element.id} />;
  } else if (element.__component === "form-elements.button") {
    return <Button {...element} key={element.id} />;
  } else if (element.__component === "page.info-box") {
    return <InfoBox {...element} key={element.id} />;
  } else if (element.__component === "page.box") {
    return <Box {...element} key={element.id} />;
  } else {
    return <div />;
  }
}

const PageContent = ({ content = [], className }: PageContentProps) => (
  <div className={className}>
    {content.map((el, idx) => (
      <div key={idx}>
        {wrapInBackground(el, wrapInContainer(el, cmsToReact(el, idx)))}
      </div>
    ))}
  </div>
);

export default PageContent;
