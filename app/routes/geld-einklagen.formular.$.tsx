import { useLoaderData, useLocation, useParams } from "@remix-run/react";
import { ValidatedForm } from "remix-validated-form";
import { ButtonNavigation } from "~/components/form/ButtonNavigation";
import PageContent from "~/components/PageContent";
import Container from "~/components/Container";
import Background from "~/components/Background";
import { type loader } from "~/routes/shared/step";
import {
  flowIDFromPathname,
  flowSpecifics,
  splatFromParams,
} from "./shared/flowSpecifics";
import { buildStepValidator } from "~/models/flows/common";
import { CSRFKey } from "~/services/security/csrfKey";
import Heading from "~/components/Heading";
import { fillTemplate } from "~/util/fillTemplate";
export { action, loader } from "~/routes/shared/step";

export default function Step() {
  const {
    csrf,
    defaultValues,
    commonContent,
    heading,
    preHeading,
    content,
    formContent,
    postFormContent,
    isLast,
    previousStep,
    templateReplacements,
  } = useLoaderData<typeof loader>();
  const stepId = splatFromParams(useParams());
  const flowId = flowIDFromPathname(useLocation().pathname);
  const { context } = flowSpecifics[flowId];
  const fieldNames = formContent.map((entry) => entry.name);
  const validator = buildStepValidator(context, fieldNames);

  const nextButtonProps = isLast
    ? { label: "Klage versenden", destination: "#" }
    : { label: commonContent.nextButtonDefaultLabel };

  return (
    <Background backgroundColor="blue">
      <div className="min-h-screen">
        <Container paddingTop="24">
          <div className="ds-stack-16">
            <div className="ds-stack-40">
              {preHeading && (
                <p className="ds-label-01-bold">
                  {fillTemplate({
                    template: preHeading,
                    replacements: templateReplacements,
                  })}
                </p>
              )}
              <Heading text={heading} look="ds-heading-02-reg" />
              <PageContent
                content={content}
                templateReplacements={templateReplacements}
                className="ds-stack-16"
              />
              <ValidatedForm
                key={`${stepId}_form`}
                method="post"
                validator={validator}
                defaultValues={defaultValues}
                noValidate
                action={stepId}
              >
                <input type="hidden" name={CSRFKey} value={csrf} />
                <div className="ds-stack-40">
                  <PageContent content={formContent} />
                  {postFormContent && <PageContent content={postFormContent} />}
                  <ButtonNavigation
                    back={{
                      destination: previousStep,
                      label: commonContent.backButtonDefaultLabel,
                    }}
                    next={nextButtonProps}
                  />
                </div>
              </ValidatedForm>
            </div>
          </div>
        </Container>
      </div>
    </Background>
  );
}
