import CheckCircleOutline from "@digitalservicebund/icons/CheckCircleOutline";
import HighlightOff from "@digitalservicebund/icons/HighlightOff";
import WarningAmber from "@digitalservicebund/icons/WarningAmber";
import { useLoaderData } from "react-router";
import ButtonContainer from "~/components/common/ButtonContainer";
import Heading from "~/components/common/Heading";
import RichText from "~/components/common/RichText";
import ContentComponents from "~/components/content/ContentComponents";
import { useFocusFirstH1 } from "~/components/hooks/useFocusFirstH1";
import { type loader } from "../result";
import { GridSection } from "~/components/layout/grid/GridSection";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { BACKGROUND_COLORS } from "~/components";

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
    backgroundColor: "blue",
    icon: <CheckCircleOutline aria-label="Information" {...iconProps} />,
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

  useFocusFirstH1();

  return (
    <>
      <GridSection
        className={`${BACKGROUND_COLORS.blue} print:hidden`}
        pt="40"
        pb="24"
      >
        <Grid
          rows={2}
          background={{
            mdColumn: { start: 1, span: 8 },
            lgColumn: { start: 2, span: 10 },
            xlColumn: { start: 2, span: 10 },
            className: `rounded-lg ${BACKGROUND_COLORS[boxProps[cmsContent.pageType].backgroundColor]}`,
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
                <Heading
                  tagName={cmsContent.heading.tagName}
                  look={cmsContent.heading.look}
                  className="flex items-center mb-0"
                >
                  {cmsContent.heading.text}
                </Heading>
                {cmsContent.hintText && (
                  <RichText html={cmsContent.hintText.html} />
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
            <ButtonContainer>
              {back.destination && (
                <a className="text-link" href={back.destination}>
                  {back.label}
                </a>
              )}
              {cmsContent.nextLink?.url && (
                <a className="text-link" href={cmsContent.nextLink.url}>
                  {next?.label}
                </a>
              )}
            </ButtonContainer>
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
