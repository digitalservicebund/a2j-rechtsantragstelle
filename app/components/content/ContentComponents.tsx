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

function cmsToReact(
  componentProps: StrapiContentComponent,
  formFlowPage?: boolean,
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
      return <List {...componentProps} formFlowPage={formFlowPage} />;
    case "page.video":
      return <Video {...componentProps} />;
    case "page.inline-notice":
      return <InlineNotice {...componentProps} formFlowPage={formFlowPage} />;
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
  readonly formFlowPage?: boolean;
};

function ContentComponents({ content = [], formFlowPage }: PageContentProps) {
  if (content.length === 0) return <></>;
  return content
    .filter((el) => el.__component !== "page.array-summary")
    .map((el) => {
      const isUserFeedback = el.__component === "page.user-feedback";
      if (formFlowPage) {
        return (
          <div key={`${el.__component}_${el.id}`}>
            {cmsToReact(el, formFlowPage)}
          </div>
        );
      }
      return (
        <GridSection
          pt={
            // @ts-expect-error TODO: why this prop doesnt exist?
            el.container?.paddingTop ?? "default"
            // el.outerBackground?.paddingTop ??
            // "default"
          }
          pb={
            // @ts-expect-error TODO: why this prop doesnt exist?
            el.container?.paddingBottom ?? "default"
            // el.outerBackground?.paddingBottom ??
            // "default"
          }
          key={`${el.__component}_${el.id}`}
          bgClass={
            BACKGROUND_COLORS[
              // @ts-expect-error TODO: why this prop doesnt exist?
              el.outerBackground
                ?.backgroundColor as keyof typeof BACKGROUND_COLORS
            ]
          }
        >
          <Grid
            background={{
              start: 1,
              span: 12,
              mdStart: 1,
              mdSpan: 8,
              lgStart: 2,
              lgSpan: 10,
              xlStart: 2,
              xlSpan: 10,
              className: classNames(
                isUserFeedback
                  ? BACKGROUND_COLORS.midBlue
                  : BACKGROUND_COLORS[
                      // @ts-expect-error TODO: why this prop doesnt exist?
                      el.container
                        ?.backgroundColor as keyof typeof BACKGROUND_COLORS
                    ],
                "rounded-lg",
              ),
            }}
          >
            {cmsToReact(el, formFlowPage)}
          </Grid>
        </GridSection>
      );
    });
}
export default ContentComponents;
