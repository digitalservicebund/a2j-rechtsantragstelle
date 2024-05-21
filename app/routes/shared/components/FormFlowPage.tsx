import { useLoaderData, useLocation, useParams } from "@remix-run/react";
import { ValidatedForm } from "remix-validated-form";
import { ButtonNavigation } from "~/components/form/ButtonNavigation";
import PageContent from "~/components/PageContent";
import Background from "~/components/Background";
import { validatorForFieldnames } from "~/services/validation/buildStepValidator";
import { CSRFKey } from "~/services/security/csrfKey";
import Heading from "~/components/Heading";
import MigrationDataOverview from "~/components/MigrationDataOverview";
import FlowNavigation from "~/components/FlowNavigation";
import { splatFromParams } from "~/services/params";
import type { loader } from "../formular.server";
import ArraySummary from "~/components/ArraySummary";

export function FormFlowPage() {
  const {
    arraySummaryData,
    buttonNavigationProps,
    content,
    csrf,
    formElements,
    heading,
    migrationData,
    navItems,
    postFormContent,
    preHeading,
    stepData,
    translations,
    navigationA11yLabels,
  } = useLoaderData<typeof loader>();
  const stepId = splatFromParams(useParams());
  const { pathname } = useLocation();
  const fieldNames = formElements.map((entry) => entry.name);
  const validator = validatorForFieldnames(fieldNames, pathname);

  return (
    <Background backgroundColor="blue">
      <div className="pt-32 min-h-screen flex flex-col-reverse justify-end md:flex-wrap md:flex-row md:justify-start">
        <div className="pb-48 md:pt-[1.4rem] md:shrink-0 md:min-w-[max-content] md:flex md:justify-end">
          <FlowNavigation
            navItems={navItems}
            a11yLabels={navigationA11yLabels}
          />
        </div>
        <div
          className={`ds-stack-40 container md:flex-1 ${navItems && "!ml-0"}`}
        >
          <div className="ds-stack-16">
            {preHeading && <p className="ds-label-01-bold">{preHeading}</p>}
            <Heading text={heading} look="ds-heading-02-reg" />
            <PageContent
              content={content}
              fullScreen={false}
              className="ds-stack-16"
            />
          </div>

          <MigrationDataOverview
            migrationData={migrationData}
            translations={translations}
          />
          {arraySummaryData && Object.keys(arraySummaryData).length != 0 && (
            <div className="!mt-24">
              {Object.entries(arraySummaryData).map(([category, array]) => (
                <ArraySummary
                  key={category}
                  category={category}
                  arrayData={array}
                  translations={translations}
                  csrf={csrf}
                />
              ))}
            </div>
          )}
          <ValidatedForm
            id={`${stepId}_form`}
            method="post"
            validator={validator}
            defaultValues={stepData}
            noValidate
            action={pathname}
          >
            <input type="hidden" name={CSRFKey} value={csrf} />
            <div className="ds-stack-40">
              <PageContent content={formElements} className="ds-stack-40" />
              <PageContent content={postFormContent} fullScreen={false} />
              <ButtonNavigation {...buttonNavigationProps} />
            </div>
          </ValidatedForm>
        </div>
      </div>
    </Background>
  );
}
