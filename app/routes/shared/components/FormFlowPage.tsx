import { useMemo } from "react";
import { useLoaderData } from "react-router";
import Background from "~/components/common/Background";
import ArraySummary from "~/components/content/arraySummary/ArraySummary";
import ContentComponents from "~/components/content/ContentComponents";
import ValidatedFlowForm from "~/components/formElements/ValidatedFlowForm";
import { FormFlowContext } from "~/components/formFlowContext";
import Heading from "~/components/common/Heading";
import { useFocusFirstH1 } from "~/components/hooks/useFocusFirstH1";
import MigrationDataOverview from "~/components/MigrationDataOverview";
import FlowNavigation from "~/components/navigation/FlowNavigation";
import { ReportProblem } from "~/components/reportProblem/ReportProblem";
import type { loader } from "../formular";

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
        <div className="w-screen h-full">
          <div className="container !pt-24 !pb-32 h-full">
            <div className="flex min-h-full md:gap-32 justify-between">
              <div className="md:mb-32 md:w-[248px]">
                <FlowNavigation
                  navItems={navItems}
                  expandAll={isValidationPage}
                />
              </div>
              <div className="flex flex-col flex-1 gap-32 md:pl-0 md:!pb-32 !pt-0 justify-between">
                <div className="ds-stack ds-stack-40">
                  <div className="ds-stack ds-stack-16" id="flow-page-content">
                    {preHeading && (
                      <p className="ds-label-01-bold">{preHeading}</p>
                    )}
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
                    Object.entries(arraySummaryData).map(
                      ([category, array]) => (
                        <ArraySummary
                          key={category}
                          category={category}
                          arrayData={{
                            configuration: array.configuration,
                            data: array.data,
                          }}
                          content={{
                            buttonLabel: array.buttonLabel,
                            description: array.description,
                            subtitle: array.subtitle,
                            title: array.title,
                            itemLabels: array.itemLabels,
                          }}
                          csrf={csrf}
                        />
                      ),
                    )}
                  <ValidatedFlowForm
                    stepData={stepData}
                    csrf={csrf}
                    formElements={formElements}
                    buttonNavigationProps={buttonNavigationProps}
                  />
                  <ContentComponents
                    content={postFormContent}
                    fullScreen={false}
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
        </div>
      </Background>
    </FormFlowContext.Provider>
  );
}
