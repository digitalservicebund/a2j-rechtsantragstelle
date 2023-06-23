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
import Input from "./Input";
import { getInputProps } from "~/services/props/getInputProps";
import RadioGroup from "~/components/RadioGroup";
import { getRadioGroupProps } from "~/services/props/getRadioGroupProps";
import type { DefaultValues } from "~/models/flows/steps";

type PageContentProps = {
  content: Array<StrapiContent>;
  defaultValues?: DefaultValues;
  templateReplacements?: Record<string, string>;
  className?: string;
};

export const keyFromElement = (element: StrapiContent) =>
  `${element.__component}_${element.id}`;

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

function cmsToReact(
  cms: StrapiContent,
  templateReplacements: Record<string, string>
) {
  const key = keyFromElement(cms);
  switch (cms.__component) {
    case "basic.heading":
      return (
        <Heading
          {...getHeadingProps(cms)}
          templateReplacements={templateReplacements}
          key={key}
        />
      );
    case "basic.paragraph":
      return (
        <Paragraph
          {...getParagraphProps(cms)}
          className="ds-body-01-reg"
          key={key}
        />
      );
    case "page.header":
      return <Header {...getHeaderProps(cms)} key={key} />;
    case "form-elements.input":
      return <Input {...getInputProps(cms)} key={key} />;
    case "form-elements.select":
      return <RadioGroup {...getRadioGroupProps(cms)} key={key} />;
    case "page.box":
      return <Box {...getBoxProps(cms)} key={key} />;
    case "page.info-box":
      return <InfoBox {...getInfoBoxProps(cms)} key={cms.id} />;
    default:
      return <></>;
  }
}

const PageContent = ({
  content = [],
  templateReplacements = {},
  className,
}: PageContentProps) => (
  <div className={className}>
    {content.map((el) => (
      <div key={keyFromElement(el)}>
        {wrapInBackground(
          el,
          wrapInContainer(el, cmsToReact(el, templateReplacements))
        )}
      </div>
    ))}
  </div>
);

export default PageContent;
