import { useLoaderData, useLocation, useParams } from "@remix-run/react";
import { ValidatedForm } from "remix-validated-form";
import { ButtonNavigation } from "~/components/form/ButtonNavigation";
import PageContent from "~/components/PageContent";
import Background from "~/components/Background";
import { buildStepValidator } from "~/models/flows/common";
import { getContext, flowIDFromPathname } from "~/models/flows/contexts";
import { CSRFKey } from "~/services/security/csrfKey";
import { fillTemplate } from "~/util/fillTemplate";
import Heading from "~/components/Heading";
import MigrationDataOverview from "~/components/MigrationDataOverview";
import FlowNavigation from "~/components/FlowNavigation";
import { splatFromParams } from "~/services/params";
import type { loader } from "../step.server";

export function StepWithPreHeading() {
  const {
    csrf,
    defaultValues,
    heading,
    preHeading,
    content,
    formContent,
    postFormContent,
    migrationData,
    templateReplacements,
    buttonNavigationProps,
    translations,
    navItems,
  } = useLoaderData<typeof loader>();
  const stepId = splatFromParams(useParams());
  const { pathname } = useLocation();
  const flowId = flowIDFromPathname(pathname);
  const context = getContext(flowId);
  const fieldNames = formContent.map((entry) => entry.name);
  const validator = buildStepValidator(context, fieldNames);

  return (
    <Background backgroundColor="blue">
      <div className="pt-32 min-h-screen flex flex-col-reverse justify-end md:flex-wrap md:flex-row md:justify-start">
        {navItems && (
          <div className="pb-48 md:pt-[1.4rem] md:shrink-0 md:grow md:min-w-[max-content] md:max-w-[calc(50vw_-_29.5rem)] md:flex md:justify-end">
            <FlowNavigation navItems={navItems} />
          </div>
        )}
        <div
          className={`ds-stack-40 container md:flex-1 ${navItems && "!ml-0"}`}
        >
          <div className="ds-stack-16">
            {preHeading && (
              <p className="ds-label-01-bold">
                {fillTemplate({
                  template: preHeading,
                  replacements: templateReplacements,
                })}
              </p>
            )}
            <Heading
              text={fillTemplate({
                template: heading ?? "",
                replacements: templateReplacements,
              })}
              look="ds-heading-02-reg"
            />
            <PageContent
              content={content}
              templateReplacements={templateReplacements}
              className="ds-stack-16"
            />
          </div>

          <MigrationDataOverview
            migrationData={migrationData}
            translations={translations}
          />
          <ValidatedForm
            id={`${stepId}_form`}
            method="post"
            validator={validator}
            defaultValues={defaultValues}
            noValidate
            action={pathname}
          >
            <input type="hidden" name={CSRFKey} value={csrf} />
            <div className="ds-stack-40">
              {formContent && formContent.length != 0 && (
                <PageContent content={formContent} className="ds-stack-40" />
              )}
              {postFormContent && postFormContent.length != 0 && (
                <PageContent content={postFormContent} />
              )}
              <ButtonNavigation {...buttonNavigationProps} />
            </div>
          </ValidatedForm>
        </div>
      </div>
    </Background>
  );
}
