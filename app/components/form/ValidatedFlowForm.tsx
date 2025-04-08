import { FormProvider, useForm } from "@rvf/react-router";
import { useParams, useLocation } from "react-router";
import type { ButtonNavigationProps } from "~/components/form/ButtonNavigation";
import { ButtonNavigation } from "~/components/form/ButtonNavigation";
import type { Context } from "~/domains/contexts";
import { StrapiFormComponents } from "~/services/cms/components/StrapiFormComponents";
import type { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";
import { splatFromParams } from "~/services/params";
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
  const stepId = splatFromParams(useParams());
  const { pathname } = useLocation();
  const fieldNames = formElements.map((entry) => entry.name);
  const validator = validatorForFieldNames(fieldNames, pathname);
  const stackClass =
    formElements.length === 0 ? "ds-stack ds-stack-0" : "ds-stack ds-stack-40";

  const form = useForm({
    id: `${stepId}_form`,
    validator: validator,
    method: "post",
    encType: "multipart/form-data",
    defaultValues: stepData,
    action: pathname,
  });

  return (
    <FormProvider scope={form.scope()}>
      <form {...form.getFormProps()}>
        <input type="hidden" name={CSRFKey} value={csrf} />
        <div className={stackClass}>
          <div className={stackClass}>
            <StrapiFormComponents components={formElements} />
          </div>
          <ButtonNavigation {...buttonNavigationProps} />
        </div>
      </form>
    </FormProvider>
  );
}

export default ValidatedFlowForm;
