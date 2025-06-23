import { useLoaderData } from "react-router";
import Container from "~/components/Container";
import { ProgressBar } from "~/components/form/ProgressBar";
import ValidatedFlowForm from "~/components/form/ValidatedFlowForm";
import PageContent from "~/components/PageContent";
import { ReportProblem } from "~/components/reportProblem/ReportProblem";
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
    shouldShowReportProblem,
  } = useLoaderData<typeof loader>();

  useFocusFirstH1();

  return (
    <div className="min-w-[100vw] flex flex-col bg-blue-100">
      <div className="flex-grow">
        <Container paddingTop="24" paddingBottom="64">
          <div className="ds-stack ds-stack-40">
            <ProgressBar {...progressProps} />
            <PageContent
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
        </Container>
      </div>
      {shouldShowReportProblem && <ReportProblem />}
    </div>
  );
}
