import { ValidatedForm } from "@rvf/react-router";
import { useLocation } from "react-router";
import type { ButtonNavigationProps } from "~/components/form/ButtonNavigation";
import { ButtonNavigation } from "~/components/form/ButtonNavigation";
import type { UserData } from "~/domains/userData";
import { shouldShowEstimatedTime } from "~/services/analytics/abTest/shouldShowEstimatedTime";
import { useAnalytics } from "~/services/analytics/useAnalytics";
import { StrapiFormComponents } from "~/services/cms/components/StrapiFormComponents";
import type { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";
import { CSRFKey } from "~/services/security/csrf/csrfKey";
import { schemaForFieldNames } from "~/services/validation/stepValidator/schemaForFieldNames";
import { EstimatedTime } from "../EstimatedTime";

type ValidatedFlowFormProps = {
  stepData: UserData;
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
  const { posthogClient } = useAnalytics();

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
        {shouldShowEstimatedTime(pathname, posthogClient) && <EstimatedTime />}
        <ButtonNavigation {...buttonNavigationProps} />
      </div>
    </ValidatedForm>
  );
}

export default ValidatedFlowForm;
