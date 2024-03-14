import type { ReactElement } from "react";
import type { StrapiContentComponent } from "~/services/cms/models/StrapiContentComponent";
import type { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";
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
import { renderTimeInputFromStrapi } from "~/services/cms/models/StrapiTimeInput";
import { renderFileInputFromStrapi } from "~/services/cms/models/StrapiFileInput";
import { renderAlertFromStrapi } from "~/services/cms/models/StrapiAlert";

export type StrapiContent = StrapiContentComponent | StrapiFormComponent;

type PageContentProps = {
  readonly content: Array<StrapiContent>;
  readonly fullScreen?: boolean;
  readonly className?: string;
};

export const keyFromElement = (element: StrapiContent) =>
  `${element.__component}_${element.id ?? 0}`;

function wrapInContainer(
  cmsData: StrapiContent,
  reactElement: ReactElement,
  fullScreen: boolean | undefined,
) {
  if (!("container" in cmsData) || cmsData.container === null)
    return reactElement;
  const isBox = cmsData.__component === "page.box";
  const isBoxWithImage = cmsData.__component === "page.box-with-image";

  const props = wrapperPropsFromCms(cmsData.container);
  return (
    <Container
      {...props}
      overhangingBackground={isBox || isBoxWithImage}
      fullScreen={fullScreen}
    >
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

function cmsToReact(strapiContent: StrapiContent) {
  const key = keyFromElement(strapiContent);
  // TODO: move from props matching to returning components (see renderCheckboxFromStrapi())
  switch (strapiContent.__component) {
    case "basic.heading":
      return <Heading {...getHeadingProps(strapiContent)} key={key} />;
    case "basic.paragraph":
      return <RichText {...getRichTextProps(strapiContent)} key={key} />;
    case "basic.alert":
      return renderAlertFromStrapi(strapiContent);
    case "page.header":
      return <Header {...getHeaderProps(strapiContent)} key={key} />;
    case "form-elements.input":
      return <Input {...getInputProps(strapiContent)} key={key} />;
    case "form-elements.date-input":
      return renderDateInputFromStrapi(strapiContent);
    case "form-elements.time-input":
      return renderTimeInputFromStrapi(strapiContent);
    case "form-elements.file-input":
      return renderFileInputFromStrapi(strapiContent);
    case "form-elements.textarea":
      return <Textarea {...getTextareaProps(strapiContent)} key={key} />;
    case "form-elements.select":
      return <RadioGroup {...getRadioGroupProps(strapiContent)} key={key} />;
    case "form-elements.dropdown":
      return <Select {...getDropdownProps(strapiContent)} key={key} />;
    case "form-elements.checkbox":
      return renderCheckboxFromStrapi(strapiContent);
    case "form-elements.tile-group":
      return <TileGroup {...getTileGroupProps(strapiContent)} key={key} />;
    case "page.box":
      return <Box {...getBoxProps(strapiContent)} key={key} />;
    case "page.info-box":
      return <InfoBox {...getInfoBoxProps(strapiContent)} key={key} />;
    case "page.link-list-box":
      return <LinkListBox {...getLinkListBoxProps(strapiContent)} key={key} />;
    case "page.box-with-image":
      return (
        <BoxWithImage {...getBoxWithImageProps(strapiContent)} key={key} />
      );
    case "page.list":
      return <List {...getListProps(strapiContent)} key={key} />;
    default:
      return <></>;
  }
}

const skipComponents = ["page.array-summary"];

function PageContent({
  content = [],
  fullScreen,
  className,
}: PageContentProps) {
  if (content.length === 0) return <></>;
  return (
    <div className={className}>
      {content
        .filter((el) => !skipComponents.includes(el.__component))
        .map((el) => (
          <div key={keyFromElement(el)}>
            {wrapInBackground(
              el,
              wrapInContainer(el, cmsToReact(el), fullScreen),
            )}
          </div>
        ))}
    </div>
  );
}
export default PageContent;
