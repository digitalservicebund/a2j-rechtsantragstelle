import type { ReactElement } from "react";
import Heading from "~/components/Heading";
import Paragraph from "~/components/Paragraph";
import Header from "./Header";
import InfoBox from "./InfoBox";
import type { StrapiContent } from "~/services/cms/models/StrapiContent";
import { wrapperPropsFromCms } from "./CommonWrapperProps";
import Box from "./Box";
import Container from "./Container";
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
import type { Replacements } from "~/util/fillTemplate";
import LinkListBox from "./LinkListBox";
import { getLinkListBoxProps } from "~/services/props/getLinkListBoxProps";
import BoxWithImage from "./BoxWithImage";
import { getBoxWithImageProps } from "~/services/props/getBoxWithImageProps";

type PageContentProps = {
  content: Array<StrapiContent>;
  templateReplacements?: Replacements;
  className?: string;
};

export const keyFromElement = (element: StrapiContent) =>
  `${element.__component}_${element.id ?? 0}`;

function wrapInContainer(cmsData: StrapiContent, reactElement: ReactElement) {
  if (!("container" in cmsData) || cmsData.container === null)
    return reactElement;
  const isBox = cmsData.__component === "page.box";
  const isBoxWithImage = cmsData.__component === "page.box-with-image";

  const props = wrapperPropsFromCms(cmsData.container);
  return (
    <Container {...props} overhangingBackground={isBox || isBoxWithImage}>
      {reactElement}
    </Container>
  );
}

function wrapInBackground(cmsData: StrapiContent, reactElement: ReactElement) {
  if (!("outerBackground" in cmsData) || cmsData.outerBackground === null)
    return reactElement;
  const props = wrapperPropsFromCms(cmsData.outerBackground);
  return <Background {...props}>{reactElement}</Background>;
}

function cmsToReact(cms: StrapiContent, templateReplacements: Replacements) {
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
      return <InfoBox {...getInfoBoxProps(cms)} key={key} />;
    case "page.link-list-box":
      return <LinkListBox {...getLinkListBoxProps(cms)} key={key} />;
    case "page.box-with-image":
      return <BoxWithImage {...getBoxWithImageProps(cms)} key={key} />;
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
          wrapInContainer(el, cmsToReact(el, templateReplacements)),
        )}
      </div>
    ))}
  </div>
);

export default PageContent;
