import type { ReactElement } from "react";
import Heading from "~/components/Heading";
import Video from "~/components/video/Video";
import { getBoxProps } from "~/services/cms/models/StrapiBox";
import { getBoxWithImageProps } from "~/services/cms/models/StrapiBoxWithImage";
import type { StrapiContentComponent } from "~/services/cms/models/StrapiContentComponent";
import { getDetailsProps } from "~/services/cms/models/StrapiDetails";
import { getHeaderProps } from "~/services/cms/models/StrapiHeader";
import { getHeadingProps } from "~/services/cms/models/StrapiHeading";
import { getInfoBoxProps } from "~/services/cms/models/StrapiInfoBox";
import { getInlineNoticeProps } from "~/services/cms/models/StrapiInlineNotice";
import { getLinkListBoxProps } from "~/services/cms/models/StrapiLinkListBox";
import { getListProps } from "~/services/cms/models/StrapiList";
import { getRichTextProps } from "~/services/cms/models/StrapiParagraph";
import { getUserFeedbackProps } from "~/services/cms/models/StrapiUserFeedback";
import { getVideoProps } from "~/services/cms/models/StrapiVideo";
import Background from "./Background";
import Box from "./Box";
import BoxWithImage from "./BoxWithImage";
import { wrapperPropsFromCms } from "./CommonWrapperProps";
import Container from "./Container";
import { Details } from "./Details";
import Header from "./Header";
import InfoBox from "./InfoBox";
import { InlineNotice } from "./InlineNotice";
import LinkListBox from "./LinkListBox";
import List from "./List";
import RichText from "./RichText";
import UserFeedback from "./userFeedback";
import { keyFromElement } from "../services/cms/keyFromElement";

function wrapInContainer(
  cmsData: StrapiContentComponent,
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

function wrapInBackground(
  cmsData: StrapiContentComponent,
  reactElement: ReactElement,
) {
  if (!("outerBackground" in cmsData) || cmsData.outerBackground === null)
    return reactElement;
  const props = wrapperPropsFromCms(cmsData.outerBackground);
  return <Background {...props}>{reactElement}</Background>;
}

function cmsToReact(strapiContent: StrapiContentComponent) {
  switch (strapiContent.__component) {
    case "basic.heading":
      return <Heading {...getHeadingProps(strapiContent)} />;
    case "basic.paragraph":
      return <RichText {...getRichTextProps(strapiContent)} />;
    case "page.header":
      return <Header {...getHeaderProps(strapiContent)} />;
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
    case "page.video":
      return <Video {...getVideoProps(strapiContent)} />;
    case "page.inline-notice":
      return <InlineNotice {...getInlineNoticeProps(strapiContent)} />;
    case "page.details-summary":
      return <Details {...getDetailsProps(strapiContent)} />;
    case "page.user-feedback":
      return <UserFeedback {...getUserFeedbackProps(strapiContent)} />;
    default:
      return <></>;
  }
}

type PageContentProps = {
  readonly content: Array<StrapiContentComponent>;
  readonly fullScreen?: boolean;
  readonly className?: string;
};

function PageContent({
  content = [],
  fullScreen,
  className,
}: PageContentProps) {
  if (content.length === 0) return <></>;
  return (
    <div className={className}>
      {content
        .filter((el) => el.__component !== "page.array-summary")
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
