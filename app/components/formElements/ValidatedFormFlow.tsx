import { ValidatedForm } from "@rvf/react-router";
import { useLocation } from "react-router";
import { getPageConfigOrArrayPageByPathname } from "~/domains/pageSchemas";
import type { UserData } from "~/domains/userData";
import type { StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";
import { buildStepSchemaWithPageSchema } from "~/services/validation/stepValidator/buildStepSchemaWithPageSchema";
import { SchemaComponents } from "./SchemaComponents";
import { getReadOnlyFieldNames } from "./schemaToForm/getReadOnlyFieldNames";
import { CsrfInput } from "~/components/formElements/inputs/csrf/CsrfInput";
import {
  ButtonNavigation,
  type ButtonNavigationProps,
} from "../common/ButtonNavigation";
import { type DynamicOptions } from "~/services/validation/dynamicSelect";

type ValidatedFlowFormProps = {
  stepData: UserData;
  formElements: StrapiFormComponent[];
  buttonNavigationProps: ButtonNavigationProps;
  dynamicOptions?: DynamicOptions;
};

function ValidatedFlowForm({
  stepData,
  formElements,
  buttonNavigationProps: { back, next },
  dynamicOptions,
}: Readonly<ValidatedFlowFormProps>) {
  const { pathname } = useLocation();
  const pageConfig = getPageConfigOrArrayPageByPathname(pathname);
  const formSchema = buildStepSchemaWithPageSchema(
    pathname,
    pageConfig?.pageSchema,
  );
  const readOnlyFieldNames = getReadOnlyFieldNames(pathname, stepData);

  return (
    <ValidatedForm
      method="post"
      encType="multipart/form-data"
      schema={formSchema}
      defaultValues={stepData}
      noValidate
      action={pathname}
    >
      {(form) => (
        <>
          <CsrfInput />
          <div className="flex flex-col">
            {pageConfig && (
              <SchemaComponents
                pageConfig={pageConfig}
                formComponents={formElements}
                className="mb-kern-space-x-large"
                readOnlyFieldNames={readOnlyFieldNames}
                dynamicOptions={dynamicOptions}
              />
            )}
            <ButtonNavigation
              back={back}
              next={next && { ...next, disabled: form.formState.isSubmitting }} // only attatch isSubmitting if 'next' exists
            />
          </div>
        </>
      )}
    </ValidatedForm>
  );
}

export default ValidatedFlowForm;
