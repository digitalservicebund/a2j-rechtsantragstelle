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
    <>
      <GridContainer
        columns={12}
        maxWidth="xl"
        paddingY="xl"
        className="bg-blue-100"
      >
        <GridItem
          span={12}
          spanXs={12}
          spanSm={12}
          spanMd={12}
          spanLg={12}
          colStart={1}
          colStartXs={1}
          colStartSm={1}
          colStartMd={1}
          colStartLg={1}
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
          </div>
        </GridItem>
      </GridContainer>
      {showReportProblem && (
        <GridContainer
          columns={12}
          maxWidth="xl"
          className="bg-blue-100"
          paddingY="xl"
        >
          <GridItem
            span={3}
            spanXs={12}
            spanMd={5}
            colStartXs={11}
            colStartSm={11}
            colStartMd={10}
            colStartLg={11}
            colStartXl={11}
          >
            <ReportProblem />
          </GridItem>
        </GridContainer>
      )}
    </>
    // <GridContainer
    //   columns={12}
    //   maxWidth="xl"
    //   paddingY="xl"
    //   paddingX="md"
    //   // columnWidths={["248px", "repeat(7, 1fr)"]}
    // >
    //   {showReportProblem && (
    //     // <div className="flex justify-end w-full relative">
    //     <GridItem
    //       span={3}
    //       spanXs={12}
    //       spanMd={5}
    //       colStartXs={10}
    //       colStartSm={10}
    //       colStartMd={10}
    //       colStartLg={10}
    //       colStartXl={10}
    //     >
    //       <ReportProblem />
    //     </GridItem>
    //     // </div>
    //   )}
    // </GridContainer>
  );
}
