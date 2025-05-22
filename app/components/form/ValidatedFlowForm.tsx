import { ValidatedForm } from "@rvf/react-router";
import { useLocation } from "react-router";
import type { ButtonNavigationProps } from "~/components/form/ButtonNavigation";
import { ButtonNavigation } from "~/components/form/ButtonNavigation";
import type { Context } from "~/domains/userData";
import { StrapiFormComponents } from "~/services/cms/components/StrapiFormComponents";
import type { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";
import { CSRFKey } from "~/services/security/csrf/csrfKey";
import { schemaForFieldNames } from "~/services/validation/stepValidator/schemaForFieldNames";
import { EstimatedTimeAbTest } from "../abTest/EstimatedTimeAbTest";

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
  const schema = schemaForFieldNames(fieldNames, pathname);

  return (
    <ValidatedForm
      method="post"
      encType="multipart/form-data"
      schema={schema}
      defaultValues={stepData}
      noValidate
      action={pathname}
    >
      <input type="hidden" name={CSRFKey} value={csrf} />
      <div className="ds-stack ds-stack-40">
        <StrapiFormComponents components={formElements} />
        {/*THIS IS A TEMPORARY SOLUTION FOR THE AB TEST IN PROZESSKOSTENHILFE*/}
        <EstimatedTimeAbTest />
        <ButtonNavigation {...buttonNavigationProps} />
      </div>
    </ValidatedForm>
  );
}

export default ValidatedFlowForm;
