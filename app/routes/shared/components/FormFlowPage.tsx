import { useLoaderData, useLocation, useParams } from "@remix-run/react";
import { ValidatedForm } from "remix-validated-form";
import ArraySummary from "~/components/arraySummary/ArraySummary";
import Background from "~/components/Background";
import { ButtonNavigation } from "~/components/form/ButtonNavigation";
import Heading from "~/components/Heading";
import MigrationDataOverview from "~/components/MigrationDataOverview";
import FlowNavigation from "~/components/navigation/FlowNavigation";
import PageContent from "~/components/PageContent";
import { StrapiFormComponents } from "~/services/cms/components/StrapiFormComponents";
import { splatFromParams } from "~/services/params";
import { CSRFKey } from "~/services/security/csrf/csrfKey";
import { validatorForFieldnames } from "~/services/validation/buildStepValidator";
import type { loader } from "../formular.server";

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
        <div className="pb-48 mx-32 md:w-[248px] md:mr-0 md:mt-[1.65rem]">
          <FlowNavigation
            navItems={navItems}
            a11yLabels={navigationA11yLabels}
          />
        </div>
        <div
          className={`ds-stack-40 container md:flex-1 ${navItems && "!ml-0 !mr-0"}`}
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
              <div className="ds-stack-40">
                <StrapiFormComponents components={formElements} />
              </div>
              <ButtonNavigation {...buttonNavigationProps} />
            </div>
          </ValidatedForm>
          <PageContent content={postFormContent} fullScreen={false} />
        </div>
      </div>
    </Background>
  );
}
