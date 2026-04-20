import { ValidatedForm } from "@rvf/react-router";
import { useLocation } from "react-router";
import { getPageSchema } from "~/domains/pageSchemas";
import type { UserData } from "~/domains/userData";
import type { StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";
import type { ButtonNavigationProps } from "../common/ButtonNavigation";
import { buildStepSchemaWithPageSchema } from "~/services/validation/stepValidator/buildStepSchemaWithPageSchema";
import { KernSchemaComponents } from "./KernSchemaComponents";
import { KernButtonNavigation } from "../kern/KernButtonNavigation";
import { getReadOnlyFieldNames } from "../formElements/schemaToForm/getReadOnlyFieldNames";
import { Csrf } from "~/components/formElements/Csrf";

type ValidatedFlowFormProps = {
  stepData: UserData;
  formElements: StrapiFormComponent[];
  buttonNavigationProps: ButtonNavigationProps;
};

function KernValidatedFlowForm({
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
          <Csrf />
          <div className="flex flex-col">
            {pageSchema && (
              <KernSchemaComponents
                pageSchema={pageSchema}
                formComponents={formElements}
                className="mb-kern-space-x-large"
                readOnlyFieldNames={readOnlyFieldNames}
              />
            )}
            <KernButtonNavigation
              back={back}
              next={next && { ...next, disabled: form.formState.isSubmitting }} // only attatch isSubmitting if 'next' exists
            />
          </div>
        </>
      )}
    </ValidatedForm>
  );
}

export default KernValidatedFlowForm;
