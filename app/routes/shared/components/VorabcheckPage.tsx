import { useLoaderData } from "react-router";
import { ProgressBar } from "~/components/common/ProgressBar";
import ContentComponents from "~/components/content/ContentComponents";
import ValidatedFlowForm from "~/components/formElements/ValidatedFlowForm";
import { useFocusFirstH1 } from "~/components/hooks/useFocusFirstH1";
import Background from "~/components/layout/Background";
import { ReportProblem } from "~/components/reportProblem/ReportProblem";
import type { loader } from "../vorabcheck";
import { GridSection } from "~/components/layout/grid/GridSection";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";

export function VorabcheckPage() {
  const {
    csrf,
    stepData,
    contentElements,
    formElements,
    progressProps,
    buttonNavigationProps,
    showReportProblem,
  } = useLoaderData<typeof loader>();

  useFocusFirstH1();

  return (
    <GridSection backgroundClass="bg-blue-100">
      <Grid>
        <GridItem
          mdColumn={{ start: 1, span: 8 }}
          lgColumn={{ start: 3, span: 8 }}
          xlColumn={{ start: 3, span: 8 }}
          className="pt-40"
          row={1}
        >
          <ProgressBar {...progressProps} />
        </GridItem>
        <GridItem
          mdColumn={{ start: 1, span: 8 }}
          lgColumn={{ start: 3, span: 6 }}
          xlColumn={{ start: 3, span: 6 }}
          className="gap-24 flex flex-col"
          row={2}
        >
          <ContentComponents
            content={contentElements}
            className="ds-stack ds-stack-16"
            managedByParent
          />
        </GridItem>
        <GridItem
          mdColumn={{ start: 1, span: 8 }}
          lgColumn={{ start: 3, span: 9 }}
          xlColumn={{ start: 3, span: 9 }}
          row={3}
          className="pb-40"
        >
          <ValidatedFlowForm
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
            className="pb-40"
            row={4}
          >
            <div className="flex justify-end relative">
              <ReportProblem />
            </div>
          </GridItem>
        )}
      </Grid>
    </GridSection>
  );
}
