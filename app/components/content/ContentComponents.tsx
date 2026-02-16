import classNames from "classnames";
import { BACKGROUND_COLORS, SECTION_BACKGROUND_COLORS } from "~/components";
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
import KernList from "../kern/KernList";
import KernHeroWithButton from "../kern/KernHeroWithButton";
import KernHero from "../kern/KernHero";
import KernTableOfContents from "../kern/KernTableOfContents";
import KernBox from "../kern/KernBox";
import KernInfoBox from "../kern/KernInfoBox";
import KernRichText from "../kern/KernRichText";
import KernHeading from "../kern/KernHeading";
import { KernInlineNotice } from "../kern/KernInlineNotice";
import KernBoxWithImage from "../kern/KernBoxWithImage";
import KernVideo from "../kern/KernVideo";
import KernUserFeedback from "../kern/UserFeedback";

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

function getContainerBackgroundColor(
  el: StrapiContentComponent,
  showKernUX: boolean,
): string {
  if (showKernUX) {
    if (el.__component === "page.hero") {
      return "bg-kern-action-default";
    }
    if (el.__component === "page.hero-with-button") {
      return "bg-kern-neutral-050";
    }

    if (el.__component === "page.box" && el.sectionBackgroundColor) {
      return SECTION_BACKGROUND_COLORS[
        el.sectionBackgroundColor as keyof typeof SECTION_BACKGROUND_COLORS
      ];
    }
  }

  const hasLayout = hasLayoutProperties(el);
  if (hasLayout && el.outerBackground?.backgroundColor) {
    return BACKGROUND_COLORS[
      el.outerBackground.backgroundColor as keyof typeof BACKGROUND_COLORS
    ];
  }
  return "";
}

function getPaddingTop(
  el: StrapiContentComponent,
  showKernUX: boolean,
): string {
  if (showKernUX) {
    if ("paddingTop" in el && el.paddingTop) {
      return el.paddingTop;
    }
    return "default";
  }

  if (hasLayoutProperties(el) && el.container?.paddingTop) {
    return el.container.paddingTop;
  }
  return "default";
}

function getPaddingBottom(
  el: StrapiContentComponent,
  showKernUX: boolean,
): string {
  if (showKernUX) {
    if ("paddingBottom" in el && el.paddingBottom) {
      return el.paddingBottom;
    }
    return "default";
  }

  if (hasLayoutProperties(el) && el.container?.paddingBottom) {
    return el.container.paddingBottom;
  }
  return "default";
}
// Map temporarily Strapi look values to Kern look values
export function mapLookValue(look: string): "success" | "warning" | "info" | "danger" {
  const lookMap: Record<string, "success" | "warning" | "info" | "danger"> = {
    error: "danger",
    success: "success",
    warning: "warning",
    tips: "info",
  };
  return lookMap[look] || "info";
}

function cmsToReact(
  componentProps: StrapiContentComponent,
  opts?: { inFlow?: boolean; showKernUX?: boolean },
) {
  if (opts?.showKernUX) {
    switch (componentProps.__component) {
      case "basic.heading":
        return <KernHeading {...componentProps} />;
      case "basic.paragraph":
        return <KernRichText {...componentProps} />;
      case "page.hero":
        return <KernHero {...componentProps} />;
      case "page.hero-with-button":
        return <KernHeroWithButton {...componentProps} />;
      case "page.box":
        return (
          <KernBox
            {...componentProps}
            items={componentProps.items?.map((item) => ({
              ...item,
              inlineNotices: item.inlineNotices?.map((notice) => ({
                ...notice,
                look: mapLookValue(notice.look),
              })),
            }))}
          />
        );
      case "page.box-with-image":
        return <KernBoxWithImage {...componentProps} />;
      case "page.info-box":
        return (
          <KernInfoBox
            {...componentProps}
            items={componentProps.items?.map((item) => ({
              ...item,
              inlineNotices: item.inlineNotices?.map((notice) => ({
                ...notice,
                look: mapLookValue(notice.look),
              })),
            }))}
          />
        );
      case "page.video":
        return <KernVideo {...componentProps} />;
      case "page.list":
        return <KernList {...componentProps} wrap={opts?.inFlow} />;
      case "page.table-of-contents":
        return <KernTableOfContents {...componentProps} />;
      case "page.user-feedback":
        return <KernUserFeedback {...componentProps} />;
      case "page.inline-notice":
        return (
          <KernInlineNotice
            {...componentProps}
            look={mapLookValue(componentProps.look)}
            wrap={opts?.inFlow}
          />
        );
      default:
        return <></>;
    }
  }

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
  readonly showKernUX?: boolean;
};

function ContentComponents({
  content = [],
  managedByParent,
  className,
  showKernUX = false,
}: PageContentProps) {
  if (content.length === 0) return [];

  const nodes = content
    .filter((el) => el.__component !== "page.array-summary")
    .map((el) => {
      const isUserFeedback =
        el.__component === "page.user-feedback" && !showKernUX;
      const isKernBox = el.__component === "page.box" && showKernUX;

      if (managedByParent) {
        return (
          <div key={`${el.__component}_${el.id}`} className={className}>
            {cmsToReact(el, { inFlow: true, showKernUX })}
          </div>
        );
      }

      return (
        <GridSection
          pt={getPaddingTop(el, showKernUX)}
          pb={getPaddingBottom(el, showKernUX)}
          className={getContainerBackgroundColor(el, showKernUX)}
          key={`${el.__component}_${el.id}`}
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
                isKernBox ? "bg-kern-neutral-050" : "",
                "rounded-lg",
              ),
            }}
          >
            {cmsToReact(el, { showKernUX })}
          </Grid>
        </GridSection>
      );
    });

  return nodes;
}
export default ContentComponents;
