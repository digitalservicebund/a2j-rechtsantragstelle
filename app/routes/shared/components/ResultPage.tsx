import CheckCircleOutline from "@digitalservicebund/icons/CheckCircleOutline";
import InfoOutline from "@digitalservicebund/icons/InfoOutline";
import HighlightOff from "@digitalservicebund/icons/HighlightOff";
import WarningAmber from "@digitalservicebund/icons/WarningAmber";
import { useLoaderData } from "react-router";
import ContentComponents from "~/components/content/ContentComponents";
import { type loader } from "../result";
import { GridSection } from "~/components/layout/grid/GridSection";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { KernIcon } from "~/components/kern/common/KernIcon";
import KernButton from "~/components/kern/KernButton";
import KernButtonContainer from "~/components/kern/KernButtonContainer";
import KernHeading from "~/components/kern/KernHeading";
import KernRichText from "~/components/kern/KernRichText";

const iconProps = {
  "aria-hidden": false,
  className: "inline-block h-[36px]! w-[36px]! min-h-[36px]! min-w-[36px]!",
};

const boxProps = {
  error: {
    backgroundColor: "red",
    icon: <HighlightOff aria-label="Negatives Ergebnis" {...iconProps} />,
  },
  success: {
    backgroundColor: "green",
    icon: <CheckCircleOutline aria-label="Positives Ergebnis" {...iconProps} />,
  },
  warning: {
    backgroundColor: "yellow",
    icon: <WarningAmber aria-label="Warnung" {...iconProps} />,
  },
  info: {
    backgroundColor: "midBlue",
    icon: <InfoOutline aria-label="Information" {...iconProps} />,
  },
} as const;

export function ResultPage() {
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
                  managedByParent
                />
                {cmsContent.hintText && (
                  <KernRichText
                    className="font-medium! text-kern-static-large!"
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
            lgColumn={{ start: 2, span: 12 }}
            xlColumn={{ start: 2, span: 12 }}
            className="py-24"
            row={2}
          >
            <KernButtonContainer>
              {back.destination && (
                <a
                  className="kern-link text-kern-static-small! no-underline!"
                  href={back.destination}
                >
                  <KernIcon name="arrow-back" />
                  {back.label}
                </a>
              )}
              {cmsContent.nextLink?.url && (
                <a
                  className="kern-link text-kern-static-small! no-underline!"
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
