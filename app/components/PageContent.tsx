import Heading from "~/components/Heading";
import type { ParagraphProps } from "~/components/Paragraph";
import Paragraph from "~/components/Paragraph";
import type { HeaderProps } from "./Header";
import Header from "./Header";
import type { InfoBoxProps } from "./InfoBox";
import InfoBox from "./InfoBox";
import type { FormContentCms } from "~/services/cms/models/FormContentCms";
import type { PageComponentCms } from "~/services/cms/models/PageComponentCms";
import type { Button as ButtonCms } from "~/services/cms/models/Button";
import type { Container as ContainerCms } from "~/services/cms/models/Container";
import type { Background as BackgroundCms } from "~/services/cms/models/Background";
import Box from "./Box";
import type { ContainerProps } from "./Container";
import Container from "./Container";
import type { BackgroundProps } from "./Background";
import Background from "./Background";
import type { ReactElement } from "react";
import Button from "./Button";
import _ from "lodash";

type PageContentProps = {
  content: Array<FormContentCms | PageComponentCms>;
  className?: string;
};

const transformCmsData = (
  cmsData: ContainerCms | BackgroundCms
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
  cmsData: { [key: string]: any; container?: ContainerCms },
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
  cmsData: { [key: string]: any; outerBackground?: BackgroundCms | null },
  reactElement: ReactElement
): ReactElement => {
  if (!cmsData.outerBackground) {
    return reactElement;
  }
  const config = transformCmsData(cmsData.outerBackground);
  return <Background {...config}>{reactElement}</Background>;
};

function cmsToReact(
  element: FormContentCms | PageComponentCms,
  key?: string | number
) {
  const props = _.omit(element, "id", "__component");
  if (element.__component === "basic.heading") {
    return <Heading {...props} key={element.id} />;
  } else if (element.__component === "basic.paragraph") {
    return (
      <Paragraph
        {...(props as ParagraphProps)}
        className="ds-body-01-reg"
        key={element.id}
      />
    );
  } else if (element.__component === "page.header") {
    return <Header {...(props as HeaderProps)} key={element.id} />;
    // } else if (element.__component === "form-elements.button") {
    //    return <Button {...props ad ButtonProps} key={element.id} />;
  } else if (element.__component === "page.info-box") {
    return <InfoBox {...(props as InfoBoxProps)} key={element.id} />;
  } else if (element.__component === "page.box") {
    return <Box {...props} key={element.id} />;
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
