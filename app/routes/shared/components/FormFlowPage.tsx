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
import { GridContainer, GridItem } from "~/components";

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
        <GridContainer
          columns={12}
          maxWidth="xxl"
          paddingY="xl"
          // columnWidths={["248px", "repeat(7, 1fr)"]}
        >
          {/* <div className="w-screen pt-32 flex flex-grow flex-col-reverse justify-end md:flex-wrap md:flex-row md:justify-start gap-48 h-full"> */}
          {/* <div className="md:w-[248px]"> */}
          <GridItem
            span={2}
            spanSm={4}
            spanMd={3}
            colStart={5}
            colStartXs={1}
            colStartSm={1}
            colStartMd={5}
            colStartLg={3}
          >
            {/* <div className="w-[248px]"> */}
            <FlowNavigation navItems={navItems} expandAll={isValidationPage} />
            {/* </div> */}
          </GridItem>
          {/* </div> */}
          {/* <div
            className={
              "flex flex-col flex-1 gap-32 container md:pl-0 md:!pb-32 !pt-0 justify-between"
            }
          > */}
          <GridItem
            span={7}
            spanXs={12}
            spanSm={12}
            spanMd={8}
            colStart={5}
            colStartXs={1}
            colStartSm={1}
            colStartMd={5}
            colStartLg={6}
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
          </GridItem>
          {/* </div> */}
          {/* </div> */}
        </GridContainer>
      </Background>
    </FormFlowContext.Provider>
  );
}
