import { useLoaderData, useLocation, useParams } from "@remix-run/react";
import { ValidatedForm, validationError } from "remix-validated-form";
import { ButtonNavigation } from "~/components/form/ButtonNavigation";
import PageContent from "~/components/PageContent";
import Container from "~/components/Container";
import Background from "~/components/Background";
import { action, loader } from "~/routes/shared/step";
import {
  flowIDFromPathname,
  flowSpecifics,
  splatFromParams,
} from "./shared/flowSpecifics";
import { buildStepValidator } from "~/models/flows/common";
import { CSRFKey } from "~/services/security/csrfKey";
import Heading from "~/components/Heading";

export { action, loader } from "~/routes/shared/step";

export default function Step() {
  const {
    csrf,
    defaultValues,
    commonContent,
    heading,
    content,
    formContent,
    isLast,
    previousStep,
    templateReplacements,
  } = useLoaderData<typeof loader>();
  const stepId = splatFromParams(useParams());
  const flowId = flowIDFromPathname(useLocation().pathname);
  const { context } = flowSpecifics[flowId];
  const fieldNames = formContent.map((entry) => entry.name);
  const validator = buildStepValidator(context, fieldNames);

  const nextLabel = isLast
    ? commonContent.lastNextButtonLabel
    : commonContent.nextButtonDefaultLabel;

  return (
    <Background backgroundColor="blue">
      <div className="min-h-screen">
        <Container paddingTop="24">
          <div className="ds-stack-16">
            <div className="ds-stack-40">
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
                  <ButtonNavigation
                    back={{
                      destination: previousStep,
                      label: commonContent.backButtonDefaultLabel,
                    }}
                    next={{ label: nextLabel }}
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
