import { useLocation } from "@remix-run/react";
import { ValidatedForm } from "@rvf/remix";
import type { ButtonNavigationProps } from "~/components/form/ButtonNavigation";
import { ButtonNavigation } from "~/components/form/ButtonNavigation";
import type { Context } from "~/domains/contexts";
import { StrapiFormComponents } from "~/services/cms/components/StrapiFormComponents";
import type { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";
import { CSRFKey } from "~/services/security/csrf/csrfKey";
import { validatorForFieldNames } from "~/services/validation/stepValidator/validatorForFieldNames";

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
  const { pathname } = useLocation();
  const fieldNames = formElements.map((entry) => entry.name);
  const validator = validatorForFieldNames(fieldNames, pathname);
  const stackClass =
    formElements.length === 0 ? "ds-stack ds-stack-0" : "ds-stack ds-stack-40";

  return (
    <ValidatedForm
      method="post"
      encType="multipart/form-data"
      validator={validator}
      defaultValues={stepData}
      noValidate
      action={pathname}
    >
      <input type="hidden" name={CSRFKey} value={csrf} />
      <div className={stackClass}>
        <div className={stackClass}>
          <StrapiFormComponents components={formElements} />
        </div>
        <ButtonNavigation {...buttonNavigationProps} />
      </div>
    </ValidatedForm>
  );
}

export default ValidatedFlowForm;
