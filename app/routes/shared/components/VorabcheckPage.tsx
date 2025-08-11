import { useLoaderData } from "react-router";
import Background from "~/components/Background";
import ContentComponents from "~/components/ContentComponents";
import ValidatedFlowForm from "~/components/form/ValidatedFlowForm";
import { useFocusFirstH1 } from "~/components/hooks/useFocusFirstH1";
import { ProgressBar } from "~/components/ProgressBar";
import { ReportProblem } from "~/components/reportProblem/ReportProblem";
import type { loader } from "../vorabcheck";

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
      <div className="w-screen h-full">
        <div className="container pt-24! pb-32! h-full">
          <div className="flex flex-col min-h-full gap-32 justify-between">
            <div className="ds-stack ds-stack-40" id="flow-page-content">
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
        </div>
      </div>
    </Background>
  );
}
