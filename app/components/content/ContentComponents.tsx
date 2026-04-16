import classNames from "classnames";
import { BACKGROUND_COLORS, SECTION_BACKGROUND_COLORS } from "~/components";
import KernSummaryOverviewSection from "~/components/kern/summaryOverview/SummaryOverviewSection";
import { GridSection } from "~/components/layout/grid/GridSection";
import type { StrapiContentComponent } from "~/services/cms/models/formElements/StrapiContentComponent";
import { Grid } from "../layout/grid/Grid";
import KernList from "../kern/KernList";
import KernHero from "../kern/KernHero";
import KernTableOfContents from "../kern/KernTableOfContents";
import KernBox from "../kern/KernBox";
import KernRichText from "../kern/KernRichText";
import KernHeading from "../kern/KernHeading";
import { KernInlineNotice } from "../kern/KernInlineNotice";
import KernVideo from "../kern/video/KernVideo";
import KernUserFeedback from "../kern/UserFeedback";
import { KernEmailCapture } from "~/components/kern/emailCapture/KernEmailCapture";
import { KernDetails } from "../kern/KernDetails";

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

function getContentBackgroundColor(el: StrapiContentComponent): string {
  if ("contentBackgroundColor" in el) {
    return SECTION_BACKGROUND_COLORS[
      el.contentBackgroundColor as keyof typeof SECTION_BACKGROUND_COLORS
    ];
  }
  return "";
}

function getPaddingTop(el: StrapiContentComponent): string {
  if ("paddingTop" in el && el.paddingTop) {
    return el.paddingTop;
  }

  if (hasLayoutProperties(el) && el.container?.paddingTop) {
    return el.container.paddingTop;
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
      return <KernHeading managedByParent {...componentProps} />;
    case "basic.paragraph":
      return <KernRichText {...componentProps} />;
    case "page.hero":
      return <KernHero {...componentProps} />;
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
    case "page.details-summary":
      return <KernDetails {...componentProps} />;
    case "page.video":
      return <KernVideo {...componentProps} />;
    case "page.list":
      return <KernList {...componentProps} wrap={opts?.inFlow} />;
    case "page.table-of-contents":
      return <KernTableOfContents {...componentProps} />;
    case "page.user-feedback":
      return <KernUserFeedback {...componentProps} />;
    case "page.summary-overview-section":
      return <KernSummaryOverviewSection {...componentProps} />;
    case "page.inline-notice":
      return (
        <KernInlineNotice
          {...componentProps}
          look={mapLookValue(componentProps.look)}
          wrap={opts?.inFlow}
        />
      );
    case "page.email-capture":
      return <KernEmailCapture {...componentProps} />;
    case "page.heading":
      return (
        <KernHeading
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
