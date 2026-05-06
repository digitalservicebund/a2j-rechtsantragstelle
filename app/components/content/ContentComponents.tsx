import classNames from "classnames";
import { SECTION_BACKGROUND_COLORS } from "~/components";
import SummaryOverviewSection from "~/components/content/summaryOverview/SummaryOverviewSection";
import { GridSection } from "~/components/layout/grid/GridSection";
import type { StrapiContentComponent } from "~/services/cms/models/formElements/StrapiContentComponent";
import { Grid } from "../layout/grid/Grid";
import List from "./list/List";
import Video from "./video/Video";
import { Details } from "./Details";
import Box from "../formElements/Box";
import Heading from "../formElements/Heading";
import RichText from "../formElements/RichText";
import UserFeedback from "./userFeedback";
import Hero from "../formElements/Hero";
import TableOfContents from "../formElements/TableOfContents";
import { InlineNotice } from "../formElements/InlineNotice";
import { EmailCapture } from "./emailCapture/EmailCapture";

function getContentBackgroundColor(el: StrapiContentComponent): string {
  if ("contentBackgroundColor" in el) {
    return SECTION_BACKGROUND_COLORS[
      el.contentBackgroundColor as keyof typeof SECTION_BACKGROUND_COLORS
    ];
  }
  return "";
}
function getSectionBackgroundColor(el: StrapiContentComponent): string {
  if ("sectionBackgroundColor" in el) {
    return SECTION_BACKGROUND_COLORS[
      el.sectionBackgroundColor as keyof typeof SECTION_BACKGROUND_COLORS
    ];
  }
  return "";
}

function getPaddingTop(el: StrapiContentComponent): string {
  if ("paddingTop" in el && el.paddingTop) {
    return el.paddingTop;
  }
  return "default";
}

function getPaddingBottom(el: StrapiContentComponent): string {
  if ("paddingBottom" in el && el.paddingBottom) {
    return el.paddingBottom;
  }
  return "default";
}
// Map temporarily Strapi look values to Kern look values
export function mapLookValue(
  look: string,
): "success" | "warning" | "info" | "danger" {
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
  opts?: { inFlow?: boolean },
) {
  switch (componentProps.__component) {
    case "basic.heading":
      return <Heading managedByParent {...componentProps} />;
    case "basic.paragraph":
      return <RichText {...componentProps} />;
    case "page.hero":
      return <Hero {...componentProps} />;
    case "page.box":
      return (
        <Box
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
    case "page.details-summary":
      return <Details {...componentProps} />;
    case "page.video":
      return <Video {...componentProps} />;
    case "page.list":
      return <List {...componentProps} wrap={opts?.inFlow} />;
    case "page.table-of-contents":
      return <TableOfContents {...componentProps} />;
    case "page.user-feedback":
      return <UserFeedback {...componentProps} />;
    case "page.summary-overview-section":
      return <SummaryOverviewSection {...componentProps} />;
    case "page.inline-notice":
      return (
        <InlineNotice
          {...componentProps}
          look={mapLookValue(componentProps.look)}
          wrap={opts?.inFlow}
        />
      );
    case "page.email-capture": {
      const { successBanner, errorBanner, ...rest } = componentProps;

      return (
        <EmailCapture
          {...rest}
          successBanner={{
            ...successBanner,
            look: mapLookValue(successBanner.look),
          }}
          errorBanner={{
            ...errorBanner,
            look: mapLookValue(errorBanner.look),
          }}
        />
      );
    }
    case "page.heading":
      return (
        <Heading
          {...componentProps.heading}
          elementId={componentProps.identifier}
        />
      );
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
  if (content.length === 0) return [];

  const nodes = content
    .filter((el) => el.__component !== "page.array-summary")
    .map((el) => {
      if (managedByParent) {
        return (
          <div key={`${el.__component}_${el.id}`} className={className}>
            {cmsToReact(el, { inFlow: true })}
          </div>
        );
      }

      return (
        <GridSection
          pt={getPaddingTop(el)}
          pb={getPaddingBottom(el)}
          key={`${el.__component}_${el.id}`}
          className={getSectionBackgroundColor(el)}
        >
          <Grid
            background={{
              mdColumn: { start: 1, span: 8 },
              lgColumn: { start: 2, span: 10 },
              xlColumn: { start: 2, span: 10 },
              className: classNames(
                getContentBackgroundColor(el),
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
