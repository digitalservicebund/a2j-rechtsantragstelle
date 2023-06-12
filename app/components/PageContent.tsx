import type { ReactElement } from "react";
import Heading from "~/components/Heading";
import Paragraph from "~/components/Paragraph";
import Header from "./Header";
import InfoBox from "./InfoBox";
import type { StrapiContent } from "~/services/cms/models/StrapiContent";
import type { StrapiContainer } from "~/services/cms/models/StrapiContainer";
import type { StrapiBackground } from "~/services/cms/models/StrapiBackground";
import Box from "./Box";
import type { ContainerProps } from "./Container";
import Container from "./Container";
import type { BackgroundProps } from "./Background";
import Background from "./Background";
import { getInfoBoxProps } from "~/services/props/getInfoBoxProps";
import { getBoxProps } from "~/services/props/getBoxProps";
import { getHeadingProps } from "~/services/props/getHeadingProps";
import { getHeaderProps } from "~/services/props/getHeaderProps";
import { getParagraphProps } from "~/services/props/getParagraphProps";

type PageContentProps = {
  content: Array<StrapiContent>;
  className?: string;
};

const transformCmsData = (
  cmsData: StrapiContainer | StrapiBackground
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
  cmsData: { [key: string]: any; container?: StrapiContainer },
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
  cmsData: { [key: string]: any; outerBackground?: StrapiBackground | null },
  reactElement: ReactElement
): ReactElement => {
  if (!cmsData.outerBackground) {
    return reactElement;
  }
  const config = transformCmsData(cmsData.outerBackground);
  return <Background {...config}>{reactElement}</Background>;
};

function cmsToReact(cms: StrapiContent) {
  switch (cms.__component) {
    case "basic.heading":
      return <Heading {...getHeadingProps(cms)} key={cms.id} />;
    case "basic.paragraph":
      return (
        <Paragraph
          {...getParagraphProps(cms)}
          className="ds-body-01-reg"
          key={cms.id}
        />
      );
    case "page.header":
      return <Header {...getHeaderProps(cms)} key={cms.id} />;
    case "page.box":
      return <Box {...getBoxProps(cms)} key={cms.id} />;
    case "page.info-box":
      return <InfoBox {...getInfoBoxProps(cms)} key={cms.id} />;
  }
}

const PageContent = ({ content = [], className }: PageContentProps) => (
  <div className={className}>
    {content.map((el, idx) => (
      <div key={idx}>
        {wrapInBackground(el, wrapInContainer(el, cmsToReact(el)))}
      </div>
    ))}
  </div>
);

export default PageContent;
