import { useMemo } from "react";
import { useLoaderData } from "react-router";
import Heading from "~/components/common/Heading";
import ArraySummary from "~/components/content/arraySummary/ArraySummary";
import ContentComponents from "~/components/content/ContentComponents";
import ValidatedFlowForm from "~/components/formElements/ValidatedFlowForm";
import { FormFlowContext } from "~/components/formFlowContext";
import { useFocusFirstH1 } from "~/components/hooks/useFocusFirstH1";
import MigrationDataOverview from "~/components/MigrationDataOverview";
import FlowNavigation from "~/components/navigation/FlowNavigation";
import { ReportProblem } from "~/components/reportProblem/ReportProblem";
import type { loader } from "../formular";
import { GridSection } from "~/components/layout/grid/GridSection";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { BACKGROUND_COLORS } from "~/components";

export function FormFlowPage() {
  const {
    arraySummaryData,
    userData,
    buttonNavigationProps,
    cmsContent,
    csrf,
    formElements,
    migration,
    navigationProps,
    stepData,
    translations,
    validFlowPaths,
    flowId,
    showReportProblem,
  } = useLoaderData<typeof loader>();

  const formFlowMemo = useMemo(
    () => ({
      userData,
      validFlowPages: validFlowPaths,
      translations: translations,
      flowId,
    }),
    [userData, validFlowPaths, translations, flowId],
  );

  useFocusFirstH1();

  return (
    <FormFlowContext.Provider value={formFlowMemo}>
      <GridSection backgroundClass={BACKGROUND_COLORS.blue} pt="40" pb="40">
        <Grid>
          <GridItem
            className="hidden lg:block"
            lgColumn={{ start: 1, span: 4 }}
            xlColumn={{ start: 1, span: 4 }}
          >
            <div className="md:mb-32 md:w-[312px]">
              <FlowNavigation {...navigationProps} />
            </div>
          </GridItem>
          <div className="lg:hidden">
            <FlowNavigation {...navigationProps} />
          </div>
          <GridItem
            mdColumn={{ start: 1, span: 8 }}
            lgColumn={{ start: 5, span: 9 }}
            xlColumn={{ start: 5, span: 9 }}
          >
            <div className="flex flex-col flex-1 gap-32 md:pl-0 md:pb-32! pt-0! justify-between">
              <div className="ds-stack ds-stack-40">
                <div className="ds-stack ds-stack-16" id="flow-page-content">
                  {cmsContent.preHeading && (
                    <p className="ds-label-01-bold">{cmsContent.preHeading}</p>
                  )}
                  <Heading text={cmsContent.heading} look="ds-heading-02-reg" />
                  <ContentComponents
                    content={cmsContent.content}
                    className="ds-stack ds-stack-16"
                    managedByParent
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
                  ))}
                <ValidatedFlowForm
                  stepData={stepData}
                  csrf={csrf}
                  formElements={formElements}
                  buttonNavigationProps={buttonNavigationProps}
                />
                <ContentComponents
                  content={cmsContent.postFormContent}
                  managedByParent
                />
              </div>
            </div>
          </GridItem>
          {showReportProblem && (
            <GridItem
              mdColumn={{ start: 1, span: 8 }}
              lgColumn={{ start: 1, span: 12 }}
              xlColumn={{ start: 1, span: 12 }}
              className="pb-40 flex justify-end"
              row={2}
            >
              <ReportProblem />
            </GridItem>
          )}
        </Grid>
      </GridSection>
    </FormFlowContext.Provider>
  );
}
