import { Link, useLoaderData } from "react-router";
import { ProgressBar } from "~/components/common/ProgressBar";
import ContentComponents from "~/components/content/ContentComponents";
import ValidatedFlowForm from "~/components/formElements/ValidatedFlowForm";
import { useFocusFirstH1 } from "~/components/hooks/useFocusFirstH1";
import type { loader } from "../vorabcheck";
import { GridSection } from "~/components/layout/grid/GridSection";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import { BACKGROUND_COLORS } from "~/components";
import { ReportProblem } from "~/components/reportProblem/ReportProblem";
import { useShowKernUX } from "~/components/hooks/useShowKernUX";
import { KernVorabcheckPage } from "./kern/KernVorabcheckPage";

function renderArraySummaryCards(
  summaries: ReturnType<
    typeof useLoaderData<typeof loader>
  >["arraySummaryData"],
) {
  if (summaries.length === 0) {
    return null;
  }

  return (
    <div className="mt-40 ds-stack ds-stack-32">
      {summaries.map((summary) => {
        const slotsToShow = Math.max(
          summary.expectedCount ?? summary.items.length,
          summary.items.length,
        );

        return Array.from({ length: slotsToShow }).map((_, index) => {
          const item = summary.items[index] as
            | Record<string, string | number | boolean | unknown[] | undefined>
            | undefined;
          const title = summary.itemTitle.replace(
            "{{index}}",
            String(index + 1),
          );
          const itemKey = `${summary.category}-${index}-${item?.vorname ?? "empty"}`;

          return (
            <div
              key={itemKey}
              className="ds-box p-24 bg-white border border-gray-400 rounded"
            >
              <div className="flex justify-between items-start mb-16">
                <h3 className="ds-heading-03-bold">{title}</h3>
                <Link
                  to={summary.baseUrl}
                  className="ds-link-01-bold"
                  aria-label={`${title} bearbeiten`}
                >
                  Bearbeiten
                </Link>
              </div>

              {item ? (
                <dl className="ds-stack ds-stack-8">
                  {summary.displayFields.map(([fieldKey, label]) => {
                    const value = item[fieldKey];
                    if (value === undefined || value === null) {
                      return null;
                    }

                    const displayValue =
                      summary.valueLabels[`${fieldKey}.${value}`] ??
                      String(value);

                    return (
                      <div key={fieldKey} className="flex gap-8">
                        <dt className="ds-label-01-reg text-gray-800">
                          {label}:
                        </dt>
                        <dd className="ds-label-01-bold">{displayValue}</dd>
                      </div>
                    );
                  })}

                  {item.hatKinder === "yes" && Array.isArray(item.kinder) && (
                    <div className="mt-8 pt-8 border-t border-gray-300">
                      <span className="ds-label-02-reg text-gray-600">
                        {item.kinder.length} Kinder eingetragen
                      </span>
                    </div>
                  )}
                </dl>
              ) : (
                <p className="ds-label-01-reg text-gray-600 italic">
                  Noch nicht ausgefüllt
                </p>
              )}
            </div>
          );
        });
      })}
    </div>
  );
}

export function VorabcheckPage() {
  const {
    csrf,
    stepData,
    cmsContent,
    formElements,
    arraySummaryData,
    progressProps,
    buttonNavigationProps,
    showReportProblem,
  } = useLoaderData<typeof loader>();

  useFocusFirstH1();
  const showKernUX = useShowKernUX();
  if (showKernUX) {
    return <KernVorabcheckPage />;
  }

  return (
    <GridSection className={BACKGROUND_COLORS.blue}>
      <Grid>
        <GridItem
          mdColumn={{ start: 1, span: 8 }}
          lgColumn={{ start: 3, span: 9 }}
          xlColumn={{ start: 3, span: 9 }}
          className="pt-40"
          row={1}
        >
          <ProgressBar {...progressProps} />
        </GridItem>
        <GridItem
          mdColumn={{ start: 1, span: 8 }}
          lgColumn={{ start: 3, span: 8 }}
          xlColumn={{ start: 3, span: 8 }}
          className="gap-24 flex flex-col"
          row={2}
        >
          <ContentComponents
            content={cmsContent.pre_form}
            className="ds-stack ds-stack-16"
            managedByParent
          />
        </GridItem>
        <GridItem
          mdColumn={{ start: 1, span: 8 }}
          lgColumn={{ start: 3, span: 8 }}
          xlColumn={{ start: 3, span: 8 }}
          row={3}
          className="pb-40"
        >
          <ValidatedFlowForm
            stepData={stepData}
            csrf={csrf}
            formElements={formElements}
            buttonNavigationProps={buttonNavigationProps}
          />
          {renderArraySummaryCards(arraySummaryData)}
        </GridItem>
        {showReportProblem && (
          <GridItem
            mdColumn={{ start: 1, span: 8 }}
            lgColumn={{ start: 1, span: 12 }}
            xlColumn={{ start: 1, span: 12 }}
            className="pb-40 flex justify-end"
            row={4}
          >
            <ReportProblem />
          </GridItem>
        )}
      </Grid>
    </GridSection>
  );
}
