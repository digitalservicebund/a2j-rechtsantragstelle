import { ValidatedForm } from "@rvf/react-router";
import { useLocation } from "react-router";
import { getPageSchema } from "~/domains/pageSchemas";
import type { UserData } from "~/domains/userData";
import type { StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";
import { ButtonNavigation } from "../common/ButtonNavigation";
import type { ButtonNavigationProps } from "../common/ButtonNavigation";
import { SchemaComponents } from "./SchemaComponents";
import { buildStepSchemaWithPageSchema } from "~/services/validation/stepValidator/buildStepSchemaWithPageSchema";
import { getReadOnlyFieldNames } from "./schemaToForm/getReadOnlyFieldNames";
import { CsrfInput } from "~/components/formElements/CsrfInput";

type ValidatedFlowFormProps = {
  stepData: UserData;
  formElements: StrapiFormComponent[];
  buttonNavigationProps: ButtonNavigationProps;
};

function ValidatedFlowForm({
  stepData,
  formElements,
  buttonNavigationProps: { back, next },
}: Readonly<ValidatedFlowFormProps>) {
  const { pathname } = useLocation();
  const pageSchema = getPageSchema(pathname);
  const formSchema = buildStepSchemaWithPageSchema(pathname, pageSchema);
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
          <div className="ds-stack ds-stack-40">
            {pageSchema && (
              <SchemaComponents
                pageSchema={pageSchema}
                formComponents={formElements}
                readOnlyFieldNames={readOnlyFieldNames}
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
