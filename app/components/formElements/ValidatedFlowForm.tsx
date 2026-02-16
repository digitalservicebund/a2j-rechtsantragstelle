import { ValidatedForm } from "@rvf/react-router";
import { useLocation } from "react-router";
import { getPageSchema } from "~/domains/pageSchemas";
import type { UserData } from "~/domains/userData";
import type { StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";
import { CSRFKey } from "~/services/security/csrf/csrfKey";
import { ButtonNavigation } from "../common/ButtonNavigation";
import type { ButtonNavigationProps } from "../common/ButtonNavigation";
import { SchemaComponents } from "./SchemaComponents";
import { buildStepSchemaWithPageSchema } from "~/services/validation/stepValidator/buildStepSchemaWithPageSchema";

type ValidatedFlowFormProps = {
  stepData: UserData;
  formElements: StrapiFormComponent[];
  buttonNavigationProps: ButtonNavigationProps;
  csrf: string;
};

function ValidatedFlowForm({
  stepData,
  formElements,
  buttonNavigationProps: { back, next },
  csrf,
}: Readonly<ValidatedFlowFormProps>) {
  const { pathname } = useLocation();

  const pageSchema = getPageSchema(pathname);
  const formSchema = buildStepSchemaWithPageSchema(pathname, pageSchema);
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
          <input type="hidden" name={CSRFKey} value={csrf} />
          <div className="ds-stack ds-stack-40">
            {pageSchema && (
              <SchemaComponents
                pageSchema={pageSchema}
                formComponents={formElements}
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
