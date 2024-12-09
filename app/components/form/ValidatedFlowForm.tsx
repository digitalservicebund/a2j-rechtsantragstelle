import { useParams, useLocation } from "@remix-run/react";
import { ValidatedForm } from "remix-validated-form";
import type { ButtonNavigationProps } from "~/components/form/ButtonNavigation";
import { ButtonNavigation } from "~/components/form/ButtonNavigation";
import { Context } from "~/domains/contexts";
import { StrapiFormComponents } from "~/services/cms/components/StrapiFormComponents";
import type { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";
import { splatFromParams } from "~/services/params";
import { CSRFKey } from "~/services/security/csrf/csrfKey";
import { validatorForFieldnames } from "~/services/validation/buildStepValidator";

type ValidatedFlowFormProps = {
  stepData: Context;
  formElements: StrapiFormComponent[];
  buttonNavigationProps: ButtonNavigationProps;
  csrf: string;
};

function ValidatedFlowForm({
  stepData,
  formElements,
  buttonNavigationProps,
  csrf,
}: Readonly<ValidatedFlowFormProps>) {
  const stepId = splatFromParams(useParams());
  const { pathname } = useLocation();
  const fieldNames = formElements.map((entry) => entry.name);
  const validator = validatorForFieldnames(fieldNames, pathname);
  return (
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
  );
}

export default ValidatedFlowForm;
