import { ValidatedForm } from "@rvf/react-router";
import { useLocation } from "react-router";
import { z } from "zod";
import type { ButtonNavigationProps } from "~/components/form/ButtonNavigation";
import { getPageSchema } from "~/domains/getPageSchema";
import type { UserData } from "~/domains/userData";
import { shouldShowEstimatedTime } from "~/services/analytics/abTest/shouldShowEstimatedTime";
import { useAnalytics } from "~/services/analytics/useAnalytics";
import type { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";
import { CSRFKey } from "~/services/security/csrf/csrfKey";
import { schemaForFieldNames } from "~/services/validation/stepValidator/schemaForFieldNames";
import { EstimatedTime } from "../EstimatedTime";
import { ButtonNavigation } from "./ButtonNavigation";
import type { ButtonNavigationProps } from "./ButtonNavigation";
import { FormComponents } from "../FormComponents";

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
  const { posthogClient } = useAnalytics();

  const pageSchema = getPageSchema(pathname);
  const inputFormElements = pageSchema ? (
    <PageFormComponents pageSchema={pageSchema} formElements={formElements} />
  ) : (
    <FormComponents components={formElements} />
  );
  const formSchema = pageSchema
    ? z.object(pageSchema)
    : schemaForFieldNames(fieldNames, pathname);

  return (
    <ValidatedForm
      method="post"
      encType="multipart/form-data"
      schema={formSchema}
      defaultValues={stepData}
      noValidate
      action={pathname}
    >
      <input type="hidden" name={CSRFKey} value={csrf} />
      <div className="ds-stack ds-stack-40">
        {inputFormElements}
        {shouldShowEstimatedTime(pathname, posthogClient) && <EstimatedTime />}
        <ButtonNavigation {...buttonNavigationProps} />
      </div>
    </ValidatedForm>
  );
}

export default ValidatedFlowForm;
