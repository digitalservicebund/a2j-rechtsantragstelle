import classNames from "classnames";
import type { ReactElement } from "react";
import { EmailCapture } from "~/components/emailCapture/EmailCapture";
import Heading from "~/components/Heading";
import Video from "~/components/video/Video";
import { keyFromElement } from "~/services/cms/keyFromElement";
import type { StrapiContentComponent } from "~/services/cms/models/StrapiContentComponent";
import Background from "./Background";
import Box from "./Box";
import BoxWithImage from "./BoxWithImage";
import { wrapperPropsFromCms } from "./CommonWrapperProps";
import Container from "./Container";
import { Details } from "./Details";
import Hero from "./Hero";
import InfoBox from "./InfoBox";
import { InlineNotice } from "./InlineNotice";
import List from "./list/List";
import RichText from "./RichText";
import SummaryOverviewSection from "./summaryOverview/SummaryOverviewSection";
import TableOfContents from "./TableOfContents";
import UserFeedback from "./userFeedback";

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
      return <Heading {...strapiContent} />;
    case "basic.paragraph":
      return <RichText {...strapiContent} />;
    case "page.hero":
      return <Hero {...strapiContent} />;
    case "page.box":
      return <Box {...strapiContent} />;
    case "page.info-box":
      return <InfoBox {...strapiContent} />;
    case "page.table-of-contents":
      return <TableOfContents {...strapiContent} />;
    case "page.box-with-image":
      return <BoxWithImage {...strapiContent} />;
    case "page.list":
      return <List {...strapiContent} />;
    case "page.video":
      return <Video {...strapiContent} />;
    case "page.inline-notice":
      return <InlineNotice {...strapiContent} />;
    case "page.details-summary":
      return <Details {...strapiContent} />;
    case "page.user-feedback":
      return <UserFeedback {...strapiContent} />;
    case "page.summary-overview-section":
      return <SummaryOverviewSection {...strapiContent} />;
    case "page.email-capture":
      return <EmailCapture {...strapiContent} />;
    case "page.array-summary":
    default:
      return <></>;
  }
}

type PageContentProps = {
  readonly content: StrapiContentComponent[];
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
    <div className={classNames(className, "w-full")}>
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
