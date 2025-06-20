import { useMemo } from "react";
import { useLoaderData } from "react-router";
import ArraySummary from "~/components/arraySummary/ArraySummary";
import { FormFlowContext } from "~/components/form/formFlowContext";
import ValidatedFlowForm from "~/components/form/ValidatedFlowForm";
import Heading from "~/components/Heading";
import MigrationDataOverview from "~/components/MigrationDataOverview";
import FlowNavigation from "~/components/navigation/FlowNavigation";
import PageContent from "~/components/PageContent";
import { ReportProblem } from "~/components/reportProblem/ReportProblem";
import { useFocusFirstH1 } from "~/components/useFocusFirstH1";
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
    postFormContent,
    preHeading,
    stepData,
    translations,
    validFlowPaths,
    flowId,
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

  const showReportProblem =
    flowId === "/beratungshilfe/antrag" ||
    flowId === "/prozesskostenhilfe/formular";

  useFocusFirstH1();

  return (
    <FormFlowContext.Provider value={formFlowMemo}>
      <div className="flex flex-col min-w-[100vw] bg-blue-100">
        <div className="pt-32 flex flex-grow flex-col-reverse justify-end md:flex-wrap md:flex-row md:justify-start gap-48">
          <div className="md:ml-32 md:w-[248px]">
            <FlowNavigation navItems={navItems} />
          </div>
          <div
            className={`ds-stack ds-stack-40 container md:pl-0 md:flex-1 !pt-0 ${navItems && "!ml-0 !mr-0"}`}
          >
            <div className="ds-stack ds-stack-16" id="form-flow-page-content">
              {preHeading && <p className="ds-label-01-bold">{preHeading}</p>}
              <Heading text={heading} look="ds-heading-02-reg" />
              <PageContent
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
            <PageContent content={postFormContent} fullScreen={false} />
          </div>
        </div>
        {showReportProblem && <ReportProblem />}
      </div>
    </FormFlowContext.Provider>
  );
}
