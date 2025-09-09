import type { ReactElement } from "react";
import Heading from "~/components/common/Heading";
import RichText from "~/components/common/RichText";
import Box from "~/components/content/Box";
import BoxWithImage from "~/components/content/BoxWithImage";
import { Details } from "~/components/content/Details";
import { EmailCapture } from "~/components/content/emailCapture/EmailCapture";
import Hero from "~/components/content/Hero";
import InfoBox from "~/components/content/InfoBox";
import { InlineNotice } from "~/components/content/InlineNotice";
import List from "~/components/content/list/List";
import SummaryOverviewSection from "~/components/content/summaryOverview/SummaryOverviewSection";
import UserFeedback from "~/components/content/userFeedback";
import Video from "~/components/content/video/Video";
import type { StrapiContentComponent } from "~/services/cms/models/formElements/StrapiContentComponent";
import TableOfContents from "./TableOfContents";
import { Section } from "../Section";
import { BACKGROUND_COLORS } from "..";

function wrapInSection(
  componentProps: StrapiContentComponent,
  reactElement: ReactElement,
) {
  return (
    <Section
      bgClass={
        // BACKGROUND_COLORS[
        //   !isBox
        //     ? (componentProps.outerBackground
        //         ?.backgroundColor as keyof typeof BACKGROUND_COLORS)
        //     : ""
        // ]
        BACKGROUND_COLORS[
          // @ts-ignore
          componentProps.outerBackground
            ?.backgroundColor as keyof typeof BACKGROUND_COLORS
        ]
        // isHero
        //   ? BACKGROUND_COLORS[
        //       componentProps.outerBackground
        //         ?.backgroundColor as keyof typeof BACKGROUND_COLORS
        //     ]
        //   : ""
      }
    >
      {reactElement}
    </Section>
  );
}

function wrapInContainer(
  componentProps: StrapiContentComponent,
  reactElement: ReactElement,
  fullScreen: boolean | undefined,
) {
  if (!("container" in componentProps) || componentProps.container === null)
    return reactElement;
  const isBox = componentProps.__component === "page.box";
  const isBoxWithImage = componentProps.__component === "page.box-with-image";
  return reactElement;
  // return (
  //   <Container
  //     {...componentProps.container}
  //     overhangingBackground={isBox || isBoxWithImage}
  //     fullScreen={fullScreen}
  //   >
  //     {reactElement}
  //   </Container>
  // );
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
  return reactElement;
  // return (
  //   <Background {...componentProps.outerBackground}>{reactElement}</Background>
  // );
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
    // <div className={classNames(className, "w-full")}>
    <>
      {content
        .filter((el) => el.__component !== "page.array-summary")
        .map((el) => (
          //     <Section
          // bgClass={
          //   BACKGROUND_COLORS[
          //   ]
          // }
          <>{wrapInSection(el, cmsToReact(el))}</>
          // >{cmsToReact(el)}</Section>
          // <div key={`${el.__component}_${el.id}`}>
          //   {wrapInBackground(
          //     el,
          //     wrapInContainer(el, cmsToReact(el), fullScreen),
          //   )}
          // </div>
        ))}
    </>
    // </div>
  );
}
export default ContentComponents;
