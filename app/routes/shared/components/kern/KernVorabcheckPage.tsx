import { useLoaderData } from "react-router";
import ContentComponents from "~/components/content/ContentComponents";
import { useFocusFirstH1 } from "~/components/hooks/useFocusFirstH1";
import type { loader } from "~/routes/shared/vorabcheck";
import { GridSection } from "~/components/layout/grid/GridSection";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { KernReportProblem } from "~/components/kern/KernReportProblem";
import { KernProgress } from "~/components/kern/KernProgressBar";
import KernValidatedFlowForm from "~/components/kernFormElements/KernValidatedFormFlow";
import classNames from "classnames";

export function KernVorabcheckPage() {
  const {
    csrf,
    stepData,
    cmsContent,
    formElements,
    progressProps,
    buttonNavigationProps,
    showReportProblem,
  } = useLoaderData<typeof loader>();

  useFocusFirstH1();

  return (
    <GridSection className="bg-kern-neutral-025">
      <Grid>
        <GridItem
          mdColumn={{ start: 1, span: 8 }}
          lgColumn={{ start: 3, span: 9 }}
          xlColumn={{ start: 3, span: 9 }}
          className="pt-40 pb-kern-space-x-large"
          row={1}
        >
          <KernProgress {...progressProps} />
        </GridItem>
        <GridItem
          mdColumn={{ start: 1, span: 8 }}
          lgColumn={{ start: 3, span: 8 }}
          xlColumn={{ start: 3, span: 8 }}
          className="gap-kern-space-x-large flex flex-col"
          row={2}
        >
          <ContentComponents
            content={cmsContent.pre_form}
            managedByParent
            showKernUX
          />
        </GridItem>
        <GridItem
          mdColumn={{ start: 1, span: 8 }}
          lgColumn={{ start: 3, span: 8 }}
          xlColumn={{ start: 3, span: 8 }}
          row={3}
          className={classNames({ "pb-80": !showReportProblem })}
        >
          <KernValidatedFlowForm
            stepData={stepData}
            csrf={csrf}
            formElements={formElements}
            buttonNavigationProps={buttonNavigationProps}
          />
        </GridItem>
        {showReportProblem && (
          <GridItem
            mdColumn={{ start: 1, span: 8 }}
            lgColumn={{ start: 1, span: 12 }}
            xlColumn={{ start: 1, span: 12 }}
            className="pb-80 pt-kern-space-x-large flex justify-end"
            row={4}
          >
            <KernReportProblem />
          </GridItem>
        )}
      </Grid>
    </GridSection>
  );
}
