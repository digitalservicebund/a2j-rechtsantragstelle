import { useLoaderData } from "react-router";
import ContentComponents from "~/components/content/ContentComponents";
import { useFocusFirstH1 } from "~/components/hooks/useFocusFirstH1";
import type { loader } from "../vorabcheck";
import { GridSection } from "~/components/layout/grid/GridSection";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import classNames from "classnames";
import ValidatedFlowForm from "~/components/formElements/ValidatedFormFlow";
import { ProgressBar } from "~/components/formElements/ProgressBar";
import { ReportProblem } from "~/components/reportProblem/ReportProblem";

export function VorabcheckPage() {
  const {
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
          <ProgressBar {...progressProps} />
        </GridItem>
        <GridItem
          mdColumn={{ start: 1, span: 8 }}
          lgColumn={{ start: 3, span: 8 }}
          xlColumn={{ start: 3, span: 8 }}
          className="gap-kern-space-x-large flex flex-col"
          row={2}
          id="flow-page-content"
        >
          <ContentComponents content={cmsContent.pre_form} managedByParent />
        </GridItem>
        <GridItem
          mdColumn={{ start: 1, span: 8 }}
          lgColumn={{ start: 3, span: 8 }}
          xlColumn={{ start: 3, span: 8 }}
          row={3}
          className={classNames({ "pb-80": !showReportProblem })}
        >
          <ValidatedFlowForm
            stepData={stepData}
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
            <ReportProblem />
          </GridItem>
        )}
      </Grid>
    </GridSection>
  );
}
