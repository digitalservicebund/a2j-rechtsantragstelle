import { useLoaderData } from "react-router";
import Background from "~/components/Background";
import ContentComponents from "~/components/ContentComponents";
import ValidatedFlowForm from "~/components/form/ValidatedFlowForm";
import { useFocusFirstH1 } from "~/components/hooks/useFocusFirstH1";
import { ProgressBar } from "~/components/ProgressBar";
import { ReportProblem } from "~/components/reportProblem/ReportProblem";
import type { loader } from "../vorabcheck.server";
import GridContainer, { GridItem } from "~/components/GridContainer";

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
    <Background backgroundColor="blue">
      <GridContainer columns={12} maxWidth="xxl" paddingY="xl">
        <GridItem
          span={6}
          colStart={3}
          colStartSm={1}
          colStartMd={3}
          colStartLg={3}
        >
          <div className="flex flex-col min-h-full gap-32 justify-between">
            <div className="ds-stack ds-stack-40">
              <ProgressBar {...progressProps} />
              <ContentComponents
                content={contentElements}
                className="ds-stack ds-stack-16"
                fullScreen={false}
              />
              <ValidatedFlowForm
                stepData={stepData}
                csrf={csrf}
                formElements={formElements}
                buttonNavigationProps={buttonNavigationProps}
              />
            </div>
            {showReportProblem && (
              <div className="flex justify-end w-full relative">
                <ReportProblem />
              </div>
            )}
          </div>
        </GridItem>
      </GridContainer>
    </Background>
  );
}
