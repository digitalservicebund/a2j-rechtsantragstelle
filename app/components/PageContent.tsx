import type { ReactElement } from "react";
import { fillTemplate, type Replacements } from "~/util/fillTemplate";
import type { StrapiContent } from "~/services/cms/models/StrapiContent";
import { wrapperPropsFromCms } from "./CommonWrapperProps";
import { getBoxProps } from "~/services/cms/models/StrapiBox";
import { getBoxWithImageProps } from "~/services/cms/models/StrapiBoxWithImage";
import { getDropdownProps } from "~/services/cms/models/StrapiDropdown";
import { getHeaderProps } from "~/services/cms/models/StrapiHeader";
import { getHeadingProps } from "~/services/cms/models/StrapiHeading";
import { getInfoBoxProps } from "~/services/cms/models/StrapiInfoBox";
import { getInputProps } from "~/services/cms/models/StrapiInput";
import { getLinkListBoxProps } from "~/services/cms/models/StrapiLinkListBox";
import { getRadioGroupProps } from "~/services/cms/models/StrapiSelect";
import { getRichTextProps } from "~/services/cms/models/StrapiParagraph";
import { getTextareaProps } from "~/services/cms/models/StrapiTextarea";
import { getListProps } from "~/services/cms/models/StrapiList";
import { getTileGroupProps } from "~/services/cms/models/StrapiTileGroup";

import Background from "./Background";
import Box from "./Box";
import BoxWithImage from "./BoxWithImage";
import Container from "./Container";
import Header from "./Header";
import Heading from "~/components/Heading";
import InfoBox from "./InfoBox";
import Input from "./inputs/Input";
import LinkListBox from "./LinkListBox";
import RadioGroup from "~/components/inputs/RadioGroup";
import RichText from "./RichText";
import Select from "./inputs/Select";
import Textarea from "./inputs/Textarea";
import List from "./List";
import TileGroup from "./inputs/TileGroup";
import { renderCheckboxFromStrapi } from "~/services/cms/models/StrapiCheckbox";
import { renderDateInputFromStrapi } from "~/services/cms/models/StrapiDateInput";
import { renderFileInputFromStrapi } from "~/services/cms/models/StrapiFileInput";
import { renderAlertFromStrapi } from "~/services/cms/models/StrapiAlert";

type PageContentProps = {
  readonly content: Array<StrapiContent>;
  readonly templateReplacements?: Replacements;
  readonly className?: string;
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
  const replacedTemplate = JSON.parse(
    fillTemplate({
      template: JSON.stringify(cms),
      replacements: templateReplacements,
    }),
  ) as StrapiContent;

  const key = keyFromElement(replacedTemplate);
  // TODO: move from props matching to returning components (see renderCheckboxFromStrapi())
  switch (replacedTemplate.__component) {
    case "basic.heading":
      return <Heading {...getHeadingProps(replacedTemplate)} key={key} />;
    case "basic.paragraph":
      return <RichText {...getRichTextProps(replacedTemplate)} key={key} />;
    case "basic.alert":
      return renderAlertFromStrapi(replacedTemplate);
    case "page.header":
      return <Header {...getHeaderProps(replacedTemplate)} key={key} />;
    case "form-elements.input":
      return <Input {...getInputProps(replacedTemplate)} key={key} />;
    case "form-elements.date-input":
      return renderDateInputFromStrapi(replacedTemplate);
    case "form-elements.file-input":
      return renderFileInputFromStrapi(replacedTemplate);
    case "form-elements.textarea":
      return <Textarea {...getTextareaProps(replacedTemplate)} key={key} />;
    case "form-elements.select":
      return <RadioGroup {...getRadioGroupProps(replacedTemplate)} key={key} />;
    case "form-elements.dropdown":
      return <Select {...getDropdownProps(replacedTemplate)} key={key} />;
    case "form-elements.checkbox":
      return renderCheckboxFromStrapi(replacedTemplate);
    case "form-elements.tile-group":
      return <TileGroup {...getTileGroupProps(replacedTemplate)} key={key} />;
    case "page.box":
      return <Box {...getBoxProps(replacedTemplate)} key={key} />;
    case "page.info-box":
      return <InfoBox {...getInfoBoxProps(replacedTemplate)} key={key} />;
    case "page.link-list-box":
      return (
        <LinkListBox {...getLinkListBoxProps(replacedTemplate)} key={key} />
      );
    case "page.box-with-image":
      return (
        <BoxWithImage {...getBoxWithImageProps(replacedTemplate)} key={key} />
      );
    case "page.list":
      return <List {...getListProps(replacedTemplate)} key={key} />;
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
