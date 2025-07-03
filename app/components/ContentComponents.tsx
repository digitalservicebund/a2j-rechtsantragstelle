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
  component: StrapiContentComponent,
  reactElement: ReactElement,
  fullScreen: boolean | undefined,
) {
  if (!("container" in component) || component.container === null)
    return reactElement;
  const isBox = component.__component === "page.box";
  const isBoxWithImage = component.__component === "page.box-with-image";

  const props = wrapperPropsFromCms(component.container);
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
  component: StrapiContentComponent,
  reactElement: ReactElement,
) {
  if (!("outerBackground" in component) || component.outerBackground === null)
    return reactElement;
  const props = wrapperPropsFromCms(component.outerBackground);
  return <Background {...props}>{reactElement}</Background>;
}

function cmsToReact(component: StrapiContentComponent) {
  switch (component.__component) {
    case "basic.heading":
      return <Heading {...component} />;
    case "basic.paragraph":
      return <RichText {...component} />;
    case "page.hero":
      return <Hero {...component} />;
    case "page.box":
      return <Box {...component} />;
    case "page.info-box":
      return <InfoBox {...component} />;
    case "page.table-of-contents":
      return <TableOfContents {...component} />;
    case "page.box-with-image":
      return <BoxWithImage {...component} />;
    case "page.list":
      return <List {...component} />;
    case "page.video":
      return <Video {...component} />;
    case "page.inline-notice":
      return <InlineNotice {...component} />;
    case "page.details-summary":
      return <Details {...component} />;
    case "page.user-feedback":
      return <UserFeedback {...component} />;
    case "page.summary-overview-section":
      return <SummaryOverviewSection {...component} />;
    case "page.email-capture":
      return <EmailCapture {...component} />;
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
