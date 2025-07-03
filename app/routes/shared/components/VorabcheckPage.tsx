import { useLoaderData } from "react-router";
import Background from "~/components/Background";
import { ProgressBar } from "~/components/form/ProgressBar";
import ValidatedFlowForm from "~/components/form/ValidatedFlowForm";
import { ReportProblem } from "~/components/reportProblem/ReportProblem";
import StrapiContentComponents from "~/components/StrapiContentComponents";
import { useFocusFirstH1 } from "~/components/useFocusFirstH1";
import type { loader } from "../vorabcheck.server";

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
        <div className="container !pt-24 !pb-32 h-full">
          <div className="flex flex-col min-h-full gap-32 justify-between">
            <div className="ds-stack ds-stack-40">
              <ProgressBar {...progressProps} />
              <StrapiContentComponents
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
