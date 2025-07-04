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
  componentProps: StrapiContentComponent,
  reactElement: ReactElement,
  fullScreen: boolean | undefined,
) {
  if (!("container" in componentProps) || componentProps.container === null)
    return reactElement;
  const isBox = componentProps.__component === "page.box";
  const isBoxWithImage = componentProps.__component === "page.box-with-image";
  return (
    <Container
      {...componentProps.container}
      overhangingBackground={isBox || isBoxWithImage}
      fullScreen={fullScreen}
    >
      {reactElement}
    </Container>
  );
}

function wrapInBackground(
  componentProps: StrapiContentComponent,
  reactElement: ReactElement,
) {
  if (
    !("outerBackground" in componentProps) ||
    componentProps.outerBackground === null
  )
    return reactElement;
  return (
    <Background {...componentProps.outerBackground}>{reactElement}</Background>
  );
}

function cmsToReact(componentProps: StrapiContentComponent) {
  switch (componentProps.__component) {
    case "basic.heading":
      return <Heading {...componentProps} />;
    case "basic.paragraph":
      return <RichText {...componentProps} />;
    case "page.hero":
      return <Hero {...componentProps} />;
    case "page.box":
      return <Box {...componentProps} />;
    case "page.info-box":
      return <InfoBox {...componentProps} />;
    case "page.table-of-contents":
      return <TableOfContents {...componentProps} />;
    case "page.box-with-image":
      return <BoxWithImage {...componentProps} />;
    case "page.list":
      return <List {...componentProps} />;
    case "page.video":
      return <Video {...componentProps} />;
    case "page.inline-notice":
      return <InlineNotice {...componentProps} />;
    case "page.details-summary":
      return <Details {...componentProps} />;
    case "page.user-feedback":
      return <UserFeedback {...componentProps} />;
    case "page.summary-overview-section":
      return <SummaryOverviewSection {...componentProps} />;
    case "page.email-capture":
      return <EmailCapture {...componentProps} />;
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

function ContentComponents({
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
export default ContentComponents;
