import React from "react";
import classNames from "classnames";
import { BACKGROUND_COLORS } from "~/components";
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
import TableOfContents from "~/components/content/TableOfContents";
import UserFeedback from "~/components/content/userFeedback";
import Video from "~/components/content/video/Video";
import { GridSection } from "~/components/layout/grid/GridSection";
import type { StrapiContentComponent } from "~/services/cms/models/formElements/StrapiContentComponent";
import { Grid } from "../layout/grid/Grid";
import { useFormFlow } from "~/components/formFlowContext";

function hasLayoutProperties(
  component: StrapiContentComponent,
): component is StrapiContentComponent & {
  outerBackground?: { backgroundColor?: string };
  container?: {
    backgroundColor?: string;
    paddingTop?: string;
    paddingBottom?: string;
  };
} {
  return "outerBackground" in component || "container" in component;
}

function getGridBackgroundColor(el: StrapiContentComponent): string {
  const hasLayout = hasLayoutProperties(el);
  if (hasLayout && el.container?.backgroundColor) {
    return BACKGROUND_COLORS[
      el.container.backgroundColor as keyof typeof BACKGROUND_COLORS
    ];
  }
  return "";
}

function getContainerBackgroundColor(el: StrapiContentComponent): string {
  const hasLayout = hasLayoutProperties(el);
  if (hasLayout && el.outerBackground?.backgroundColor) {
    return BACKGROUND_COLORS[
      el.outerBackground.backgroundColor as keyof typeof BACKGROUND_COLORS
    ];
  }
  return "";
}

function cmsToReact(
  componentProps: StrapiContentComponent,
  opts?: { inFlow?: boolean },
) {
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
      return <List {...componentProps} wrap={opts?.inFlow} />;
    case "page.video":
      return <Video {...componentProps} />;
    case "page.inline-notice":
      return <InlineNotice {...componentProps} wrap={opts?.inFlow} />;
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
  readonly className?: string;
  readonly managedByParent?: boolean;
};

function ContentComponents({
  content = [],
  managedByParent,
  className,
}: PageContentProps) {
  const { flowId } = useFormFlow();

  if (content.length === 0) return [];

  const nodes = content
    .filter((el) => el.__component !== "page.array-summary")
    .filter((el) => {
      // Filter out old summary for PKH and BerH - they use the new auto-generated summary
      return !(el.__component === "page.summary-overview-section" &&
               (flowId === "/prozesskostenhilfe/formular" ||
                flowId === "/beratungshilfe/antrag"));
    })
    .map((el) => {
      const isUserFeedback = el.__component === "page.user-feedback";
      const hasLayout = hasLayoutProperties(el);

      if (managedByParent) {
        return (
          <div key={`${el.__component}_${el.id}`} className={className}>
            {cmsToReact(el, { inFlow: true })}
          </div>
        );
      }

      return (
        <GridSection
          pt={
            hasLayout && el.container?.paddingTop
              ? el.container.paddingTop
              : "default"
          }
          pb={
            hasLayout && el.container?.paddingBottom
              ? el.container.paddingBottom
              : "default"
          }
          key={`${el.__component}_${el.id}`}
          className={getContainerBackgroundColor(el)}
        >
          <Grid
            background={{
              mdColumn: { start: 1, span: 8 },
              lgColumn: { start: 2, span: 10 },
              xlColumn: { start: 2, span: 10 },
              className: classNames(
                isUserFeedback
                  ? BACKGROUND_COLORS.midBlue
                  : getGridBackgroundColor(el),
                "rounded-lg",
              ),
            }}
          >
            {cmsToReact(el)}
          </Grid>
        </GridSection>
      );
    });

  return nodes;
}
export default ContentComponents;
