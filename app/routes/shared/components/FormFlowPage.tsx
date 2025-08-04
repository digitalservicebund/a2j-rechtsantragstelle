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
import { GridContainer, GridItem } from "~/components";
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
      <GridContainer
        columns={12}
        maxWidth="xl"
        paddingY="xxl"
        paddingX="none"
        alignItems="start"
        className="bg-blue-100"
      >
        <GridItem
          span={3}
          spanSm={3}
          spanMd={3}
          spanLg={3}
          spanXl={3}
          colStartXs={1}
          colStartSm={1}
          colStartMd={1}
          colStartLg={1}
          colStartXl={1}
        >
          <div className="md:w-[248px]">
            <FlowNavigation navItems={navItems} expandAll={isValidationPage} />
          </div>
        </GridItem>
        <GridItem
          span={7}
          spanXs={12}
          spanSm={12}
          spanMd={7}
          spanLg={7}
          colStart={1}
          colStartXs={2}
          colStartSm={2}
          colStartMd={5}
          colStartLg={4}
        >
          <div className="ds-stack ds-stack-40">
            <div className="ds-stack ds-stack-16" id="flow-page-content">
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
        </GridItem>
      </GridContainer>
      <GridContainer
        columns={12}
        maxWidth="xl"
        paddingY="xl"
        paddingX="md"
        className="bg-blue-100"
      >
        {showReportProblem && (
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
        )}
      </GridContainer>
    </FormFlowContext.Provider>
  );
}
