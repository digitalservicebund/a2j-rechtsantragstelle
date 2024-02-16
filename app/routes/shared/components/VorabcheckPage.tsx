import { useLoaderData, useLocation, useParams } from "@remix-run/react";
import { ValidatedForm } from "remix-validated-form";
import { ButtonNavigation } from "~/components/form/ButtonNavigation";
import PageContent from "~/components/PageContent";
import Container from "~/components/Container";
import Background from "~/components/Background";
import { ProgressBar } from "~/components/form/ProgressBar";
import { buildStepValidator } from "~/models/flows/common";
import { getContext, flowIDFromPathname } from "~/models/flows/contexts";
import { CSRFKey } from "~/services/security/csrfKey";
import { splatFromParams } from "~/services/params";
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
  const flowId = flowIDFromPathname(pathname);
  const context = getContext(flowId);
  const fieldNames = formElements.map((entry) => entry.name);
  const validator = buildStepValidator(context, fieldNames);

  return (
    <Background backgroundColor="blue">
      <div className="min-h-screen">
        <Container paddingTop="24" paddingBottom="64">
          <div className="ds-stack-16">
            <ProgressBar {...progressProps} />
            <div className="ds-stack-40">
              <PageContent content={contentElements} className="ds-stack-16" />
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
