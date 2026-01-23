import { ValidatedForm } from "@rvf/react-router";
import { useLocation } from "react-router";
import { getPageSchema } from "~/domains/pageSchemas";
import type { UserData } from "~/domains/userData";
import type { StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";
import { CSRFKey } from "~/services/security/csrf/csrfKey";
import type { ButtonNavigationProps } from "../common/ButtonNavigation";
import { buildStepSchemaWithPageSchema } from "~/services/validation/stepValidator/buildStepSchemaWithPageSchema";
import { KernSchemaComponents } from "./KernSchemaComponents";
import { KernButtonNavigation } from "../kern/KernButtonNavigation";
import { useShowKernUX } from "../hooks/useShowKernUX";

type ValidatedFlowFormProps = {
  stepData: UserData;
  formElements: StrapiFormComponent[];
  buttonNavigationProps: ButtonNavigationProps;
  csrf: string;
};

function KernValidatedFlowForm({
  stepData,
  formElements,
  buttonNavigationProps: { back, next },
  csrf,
}: Readonly<ValidatedFlowFormProps>) {
  const { pathname } = useLocation();

  const pageSchema = getPageSchema(pathname);
  const formSchema = buildStepSchemaWithPageSchema(pathname, pageSchema);
  const showKernUX = useShowKernUX();

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
          <div className="kern-stack">
            {pageSchema && (
              <KernSchemaComponents
                pageSchema={pageSchema}
                formComponents={formElements}
                showKernUX={showKernUX}
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
