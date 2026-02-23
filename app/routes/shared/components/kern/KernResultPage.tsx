import { useLoaderData } from "react-router";
import ContentComponents from "~/components/content/ContentComponents";
import { GridSection } from "~/components/layout/grid/GridSection";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { type loader } from "~/routes/shared/result";
import { KernIcon } from "~/components/kern/common/KernIcon";
import KernHeading from "~/components/kern/KernHeading";
import KernRichText from "~/components/kern/KernRichText";
import KernButton from "~/components/kern/KernButton";
import KernButtonContainer from "~/components/kern/KernButtonContainer";

const iconProps = {
  "aria-hidden": false,
  iconClassName:
    "inline-block h-[32px]! w-[32px]! min-h-[32px]! min-w-[32px] mt-3",
};

const boxProps = {
  error: {
    backgroundColor: "kern-alert--danger",
    icon: (
      <KernIcon
        name="emergency-home"
        className={`${iconProps.iconClassName} fill-kern-feedback-danger!`}
        aria-label="Negatives Ergebnis"
      />
    ),
  },
  success: {
    backgroundColor: "kern-alert--success",
    icon: (
      <KernIcon
        name="check-circle"
        className={`${iconProps.iconClassName} fill-kern-feedback-success!`}
        aria-label="Positives Ergebnis"
      />
    ),
  },
  warning: {
    backgroundColor: "kern-alert--warning",
    icon: (
      <KernIcon
        name="warning"
        className={`${iconProps.iconClassName} fill-kern-feedback-warning!`}
        aria-label="Warnung"
      />
    ),
  },
  info: {
    backgroundColor: "kern-alert--info",
    icon: (
      <KernIcon
        name="info"
        className={`${iconProps.iconClassName} fill-kern-feedback-info!`}
        aria-label="Information"
      />
    ),
  },
} as const;

export function KernResultPage() {
  const {
    cmsContent,
    buttonNavigationProps: { back, next },
  } = useLoaderData<typeof loader>();
  const documentsList = cmsContent.documents;
  const nextSteps = cmsContent.nextSteps;
  const content = cmsContent.freeZone;

  return (
    <>
      <GridSection className="print:hidden" pt="40" pb="24">
        <Grid
          rows={2}
          background={{
            mdColumn: { start: 1, span: 8 },
            lgColumn: { start: 2, span: 10 },
            xlColumn: { start: 2, span: 10 },
            className: `rounded-lg ${boxProps[cmsContent.pageType].backgroundColor} border-2 border-${boxProps[cmsContent.pageType].backgroundColor}`,
          }}
        >
          <GridItem
            mdColumn={{ start: 1, span: 8 }}
            lgColumn={{ start: 3, span: 8 }}
            xlColumn={{ start: 3, span: 8 }}
            className="pt-32 pb-40 py-24 px-16 md:px-16 lg:px-0 xl:px-0"
            row={1}
          >
            <div className="flex sm:flex-row flex-col gap-16">
              {boxProps[cmsContent.pageType].icon}
              <div className="flex flex-col gap-16" id="flow-page-content">
                <KernHeading
                  tagName={cmsContent.heading.tagName}
                  text={cmsContent.heading.text}
                  className="kern-heading-large p-0!"
                />
                {cmsContent.hintText && (
                  <KernRichText
                    className="text-xl font-medium"
                    html={cmsContent.hintText.html}
                  />
                )}
                {cmsContent.hintButton && (
                  <div className="flex flex-wrap mt-16">
                    <KernButton {...cmsContent.hintButton} />
                  </div>
                )}
              </div>
            </div>
          </GridItem>
          <GridItem
            mdColumn={{ start: 1, span: 8 }}
            lgColumn={{ start: 3, span: 12 }}
            xlColumn={{ start: 3, span: 12 }}
            className="py-24 px-16 md:px-16 lg:px-0 xl:px-0"
            row={2}
          >
            <KernButtonContainer>
              {back.destination && (
                <a
                  className="kern-link kern-link--small no-underline!"
                  href={back.destination}
                >
                  <KernIcon name="arrow-back" />
                  {back.label}
                </a>
              )}
              {cmsContent.nextLink?.url && (
                <a
                  className="kern-link kern-link--small no-underline!"
                  href={cmsContent.nextLink.url}
                >
                  <KernIcon name="keyboard-double-arrow-left" />
                  {next?.label}
                </a>
              )}
            </KernButtonContainer>
          </GridItem>
        </Grid>
      </GridSection>

      {content.length > 0 && <ContentComponents content={content} />}

      {documentsList.length > 0 &&
        documentsList.map((element) => (
          <ContentComponents
            key={`${element.__component}_${element.id}`}
            content={[element]}
          />
        ))}

      <ContentComponents content={nextSteps} />
    </>
  );
}
