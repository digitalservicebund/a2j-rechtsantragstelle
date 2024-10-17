import { useLoaderData, useLocation, useParams } from "@remix-run/react";
import { ValidatedForm } from "remix-validated-form";
import Background from "~/components/Background";
import Container from "~/components/Container";
import { ButtonNavigation } from "~/components/form/ButtonNavigation";
import { ProgressBar } from "~/components/form/ProgressBar";
import PageContent from "~/components/PageContent";
import { StrapiFormComponents } from "~/services/cms/components/StrapiFormComponents";
import { getFieldsByFormElements } from "~/services/cms/getFieldsByFormElements";
import { splatFromParams } from "~/services/params";
import { CSRFKey } from "~/services/security/csrf/csrfKey";
import { validatorForFieldnames } from "~/services/validation/buildStepValidator";
import type { loader } from "../vorabcheck.server";

export function VorabcheckPage() {
  const {
    csrf,
    stepData,
    contentElements,
    formElements,
    progressProps,
    buttonNavigationProps,
  } = useLoaderData<typeof loader>();
  const stepId = splatFromParams(useParams());
  const { pathname } = useLocation();
  const fieldNames = getFieldsByFormElements(formElements);
  const validator = validatorForFieldnames(fieldNames, pathname);

  return (
    <Background backgroundColor="blue">
      <div className="min-h-screen">
        <Container paddingTop="24" paddingBottom="64">
          <div className="ds-stack-16">
            <ProgressBar {...progressProps} />
            <div className="ds-stack-40">
              <PageContent
                content={contentElements}
                className="ds-stack-16"
                fullScreen={false}
              />
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
            </div>
          </div>
        </Container>
      </div>
    </Background>
  );
}
