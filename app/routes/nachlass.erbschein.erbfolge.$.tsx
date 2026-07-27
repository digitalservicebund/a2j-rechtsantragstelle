import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import classNames from "classnames";
import ContentComponents from "~/components/content/ContentComponents";
import { useFocusFirstH1 } from "~/components/hooks/useFocusFirstH1";
import { GridSection } from "~/components/layout/grid/GridSection";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import ValidatedFlowForm from "~/components/formElements/ValidatedFormFlow";
import { ProgressBar } from "~/components/layout/ProgressBar";
import { ReportProblem } from "~/components/content/reportProblem/ReportProblem";
import type { ArrayData } from "~/domains/userData";
import { KinderSummary } from "~/domains/nachlass/erbschein/erbfolge/components/KinderSummary";
import { ElternteilSummary } from "~/domains/nachlass/erbschein/erbfolge/components/ElternteilSummary";
import { erbfolgeVorabcheckExtras } from "~/domains/nachlass/erbschein/erbfolge/vorabcheckExtras";
import {
  loadVorabcheckData,
  runVorabcheckAction,
} from "~/routes/shared/newEngineVorabcheck.server";
import { throw404IfFeatureFlagDisabled } from "~/services/errorPages/throw404";

const ERBFOLGE_FEATURE_FLAG = "showNachlassErbscheinErbfolgeFlow";

export const loader = (args: LoaderFunctionArgs) =>
  loadVorabcheckData(args, erbfolgeVorabcheckExtras);

export const action = async (args: ActionFunctionArgs) => {
  await throw404IfFeatureFlagDisabled(ERBFOLGE_FEATURE_FLAG);
  return runVorabcheckAction(args);
};

function NachlassErbfolgePage() {
  const {
    stepData,
    cmsContent,
    formElements,
    progressProps,
    buttonNavigationProps,
    showReportProblem,
    arraySummaryData,
    deceasedPersonName,
    dynamicOptions,
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
          <ProgressBar
            progress={progressProps?.progress ?? 0}
            max={progressProps?.max ?? 0}
          />
        </GridItem>
        <GridItem
          mdColumn={{ start: 1, span: 8 }}
          lgColumn={{ start: 3, span: 8 }}
          xlColumn={{ start: 3, span: 8 }}
          className="gap-kern-space-x-large flex flex-col"
          row={2}
          id="flow-page-content"
        >
          <ContentComponents content={cmsContent.content} managedByParent />
          {arraySummaryData?.category === "elternteile" && (
            <ElternteilSummary
              data={arraySummaryData.arrayData.data as ArrayData}
              configuration={arraySummaryData.arrayData.configuration}
              deceasedPersonName={deceasedPersonName}
            />
          )}
          {arraySummaryData && arraySummaryData.category !== "elternteile" && (
            <KinderSummary
              data={arraySummaryData.arrayData.data as ArrayData}
              configuration={arraySummaryData.arrayData.configuration}
              category={arraySummaryData.category}
              deceasedPersonName={deceasedPersonName}
            />
          )}
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
            dynamicOptions={dynamicOptions}
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

export default NachlassErbfolgePage;
