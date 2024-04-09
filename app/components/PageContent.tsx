import type { ReactElement } from "react";
import type { StrapiContentComponent } from "~/services/cms/models/StrapiContentComponent";
import type { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";
import { wrapperPropsFromCms } from "./CommonWrapperProps";
import { getBoxProps } from "~/services/cms/models/StrapiBox";
import { getBoxWithImageProps } from "~/services/cms/models/StrapiBoxWithImage";
import { StrapiDropdown } from "~/services/cms/components/StrapiDropdown";
import { getHeaderProps } from "~/services/cms/models/StrapiHeader";
import { getHeadingProps } from "~/services/cms/models/StrapiHeading";
import { getInfoBoxProps } from "~/services/cms/models/StrapiInfoBox";
import { StrapiInput } from "~/services/cms/components/StrapiInput";
import { getLinkListBoxProps } from "~/services/cms/models/StrapiLinkListBox";
import { StrapiSelect } from "~/services/cms/components/StrapiSelect";
import { getRichTextProps } from "~/services/cms/models/StrapiParagraph";
import { StrapiTextarea } from "~/services/cms/components/StrapiTextarea";
import { getListProps } from "~/services/cms/models/StrapiList";
import { StrapiTileGroup } from "~/services/cms/components/StrapiTileGroup";

import Background from "./Background";
import Box from "./Box";
import BoxWithImage from "./BoxWithImage";
import Container from "./Container";
import Header from "./Header";
import Heading from "~/components/Heading";
import InfoBox from "./InfoBox";
import LinkListBox from "./LinkListBox";
import RichText from "./RichText";
import List from "./List";
import { StrapiCheckbox } from "~/services/cms/components/StrapiCheckbox";
import { StrapiDateInput } from "~/services/cms/components/StrapiDateInput";
import { StrapiTimeInput } from "~/services/cms/components/StrapiTimeInput";
import { StrapiFileInput } from "~/services/cms/components/StrapiFileInput";
import { renderAlertFromStrapi } from "~/services/cms/models/StrapiAlert";
import { StrapiInlineNotice } from "~/services/cms/components/StrapiInlineNotice";

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
  switch (strapiContent.__component) {
    case "basic.heading":
      return <Heading {...getHeadingProps(strapiContent)} />;
    case "basic.paragraph":
      return <RichText {...getRichTextProps(strapiContent)} />;
    case "basic.alert":
      return renderAlertFromStrapi(strapiContent);
    case "basic.inline-notice":
      return <StrapiInlineNotice {...strapiContent} />;
    case "page.header":
      return <Header {...getHeaderProps(strapiContent)} />;
    case "form-elements.input":
      return <StrapiInput {...strapiContent} />;
    case "form-elements.date-input":
      return <StrapiDateInput {...strapiContent} />;
    case "form-elements.time-input":
      return <StrapiTimeInput {...strapiContent} />;
    case "form-elements.file-input":
      return <StrapiFileInput {...strapiContent} />;
    case "form-elements.textarea":
      return <StrapiTextarea {...strapiContent} />;
    case "form-elements.select":
      return <StrapiSelect {...strapiContent} />;
    case "form-elements.dropdown":
      return <StrapiDropdown {...strapiContent} />;
    case "form-elements.checkbox":
      return <StrapiCheckbox {...strapiContent} />;
    case "form-elements.tile-group":
      return <StrapiTileGroup {...strapiContent} />;
    case "page.box":
      return <Box {...getBoxProps(strapiContent)} />;
    case "page.info-box":
      return <InfoBox {...getInfoBoxProps(strapiContent)} />;
    case "page.link-list-box":
      return <LinkListBox {...getLinkListBoxProps(strapiContent)} />;
    case "page.box-with-image":
      return <BoxWithImage {...getBoxWithImageProps(strapiContent)} />;
    case "page.list":
      return <List {...getListProps(strapiContent)} />;
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
