import { useLoaderData, useLocation } from "@remix-run/react";
import { useMemo } from "react";
import ArraySummary from "~/components/arraySummary/ArraySummary";
import Background from "~/components/Background";
import { FlowFormularContext } from "~/components/form/flowFormularContext";
import ValidatedFlowForm from "~/components/form/ValidatedFlowForm";
import Heading from "~/components/Heading";
import MigrationDataOverview from "~/components/MigrationDataOverview";
import FlowNavigation from "~/components/navigation/FlowNavigation";
import PageContent from "~/components/PageContent";
import SummaryDataOverview from "~/domains/fluggastrechte/components/SummaryDataOverview";
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
    navigationA11yLabels,
    validPathsAndFields,
    flowId,
  } = useLoaderData<typeof loader>();
  const { pathname } = useLocation();

  const flowFormularMemo = useMemo(
    () => ({
      userData: prunedUserData,
      validFlowPages: validPathsAndFields,
      translations: translations,
      flowId,
    }),
    [prunedUserData, validPathsAndFields, translations, flowId],
  );

  return (
    <FlowFormularContext.Provider value={flowFormularMemo}>
      <Background backgroundColor="blue">
        <div className="pt-32 min-h-screen flex flex-col-reverse justify-end md:flex-wrap md:flex-row md:justify-start">
          <div className="pb-48 mx-32 md:w-[248px] md:mr-0 md:mt-[1.65rem]">
            <FlowNavigation
              navItems={navItems}
              a11yLabels={navigationA11yLabels}
            />
          </div>
          <div
            className={`ds-stack-40 container md:flex-1 ${navItems && "!ml-0 !mr-0"}`}
          >
            <div className="ds-stack-16" id="form-flow-page-content">
              {preHeading && <p className="ds-label-01-bold">{preHeading}</p>}
              <Heading text={heading} look="ds-heading-02-reg" />
              <PageContent
                content={content}
                fullScreen={false}
                className="ds-stack-16"
              />
            </div>

            <MigrationDataOverview
              userData={migration.userData}
              translations={translations}
              sortedFields={migration.sortedFields}
              buttonUrl={migration.buttonUrl}
            />

            {/* TODO: temporary solution - ZOV will make a component out of it*/}
            {pathname === "/fluggastrechte/formular/zusammenfassung/start" && (
              <SummaryDataOverview
                userData={prunedUserData}
                translations={translations}
              />
            )}
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
      </Background>
    </FlowFormularContext.Provider>
  );
}
