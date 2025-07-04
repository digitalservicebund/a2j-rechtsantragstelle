import { useMemo } from "react";
import { useLoaderData } from "react-router";
import ArraySummary from "~/components/arraySummary/ArraySummary";
import Background from "~/components/Background";
import ContentComponents from "~/components/ContentComponents";
import { FormFlowContext } from "~/components/form/formFlowContext";
import ValidatedFlowForm from "~/components/form/ValidatedFlowForm";
import Heading from "~/components/Heading";
import { useFocusFirstH1 } from "~/components/hooks/useFocusFirstH1";
import MigrationDataOverview from "~/components/MigrationDataOverview";
import FlowNavigation from "~/components/navigation/FlowNavigation";
import { ReportProblem } from "~/components/reportProblem/ReportProblem";
import type { loader } from "../formular.server";

export function FormFlowPage() {
  const {
    arraySummaryData,
    prunedUserData,
    buttonNavigationProps,
    content,
    csrf,
    formElements,
    heading,
    migration,
    navItems,
    isValidationPage,
    postFormContent,
    preHeading,
    stepData,
    translations,
    validFlowPaths,
    flowId,
    showReportProblem,
  } = useLoaderData<typeof loader>();

  const formFlowMemo = useMemo(
    () => ({
      userData: prunedUserData,
      validFlowPages: validFlowPaths,
      translations: translations,
      flowId,
    }),
    [prunedUserData, validFlowPaths, translations, flowId],
  );

  useFocusFirstH1();

  return (
    <FormFlowContext.Provider value={formFlowMemo}>
      <Background backgroundColor="blue">
        <div className="w-screen pt-32 flex flex-grow flex-col-reverse justify-end md:flex-wrap md:flex-row md:justify-start gap-48 h-full">
          <div className="md:ml-32 md:mb-32 md:w-[248px]">
            <FlowNavigation navItems={navItems} expandAll={isValidationPage} />
          </div>
          <div
            className={
              "flex flex-col flex-1 gap-32 container md:pl-0 md:!pb-32 !pt-0 justify-between"
            }
          >
            <div className="ds-stack ds-stack-40">
              <div className="ds-stack ds-stack-16" id="form-flow-page-content">
                {preHeading && <p className="ds-label-01-bold">{preHeading}</p>}
                <Heading text={heading} look="ds-heading-02-reg" />
                <ContentComponents
                  content={content}
                  fullScreen={false}
                  className="ds-stack ds-stack-16"
                />
              </div>

              <MigrationDataOverview
                userData={migration.userData}
                translations={translations}
                sortedFields={migration.sortedFields}
                buttonUrl={migration.buttonUrl}
              />
              {arraySummaryData &&
                Object.keys(arraySummaryData).length !== 0 &&
                Object.entries(arraySummaryData).map(([category, array]) => (
                  <ArraySummary
                    key={category}
                    category={category}
                    arrayData={array}
                    translations={translations}
                    csrf={csrf}
                  />
                ))}
              <ValidatedFlowForm
                stepData={stepData}
                csrf={csrf}
                formElements={formElements}
                buttonNavigationProps={buttonNavigationProps}
              />
              <ContentComponents content={postFormContent} fullScreen={false} />
            </div>
            {showReportProblem && (
              <div className="flex justify-end w-full relative">
                <ReportProblem />
              </div>
            )}
          </div>
        </div>
      </Background>
    </FormFlowContext.Provider>
  );
}
