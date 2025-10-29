import { ValidatedForm } from "@rvf/react-router";
import { useLocation } from "react-router";
import { z } from "zod";
import { getPageSchema } from "~/domains/pageSchemas";
import type { UserData } from "~/domains/userData";
import { getFieldsByFormElements } from "~/services/cms/getFieldsByFormElements";
import type { StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";
import { CSRFKey } from "~/services/security/csrf/csrfKey";
import { schemaForFieldNames } from "~/services/validation/stepValidator/schemaForFieldNames";
import { ButtonNavigation } from "../common/ButtonNavigation";
import type { ButtonNavigationProps } from "../common/ButtonNavigation";
import { FormComponents } from "../FormComponents";
import { SchemaComponents } from "./SchemaComponents";
import { useEffect, useLayoutEffect, useState } from "react";

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
  const fieldNames = getFieldsByFormElements(formElements);

  const [persistedData, setPersistedData] = useState<UserData>(stepData);

  useLayoutEffect(() => {
    const saved = globalThis.localStorage.getItem(`form-${pathname}`);
    if (saved) {
      setPersistedData(JSON.parse(saved));
    } else {
      setPersistedData(stepData);
    }
  }, [pathname]);

  useEffect(() => {
    globalThis.localStorage.setItem(
      `form-${pathname}`,
      JSON.stringify(persistedData),
    );
  }, [pathname, persistedData]);

  const pageSchema = getPageSchema(pathname);
  const inputFormElements = pageSchema ? (
    <SchemaComponents pageSchema={pageSchema} formComponents={formElements} />
  ) : (
    <FormComponents components={formElements} />
  );
  const formSchema = pageSchema
    ? z.object(pageSchema)
    : schemaForFieldNames(fieldNames, pathname);

  // if (!persistedData || Object.keys(persistedData).length === 0) return null;

  return (
    <ValidatedForm
      method="post"
      encType="multipart/form-data"
      schema={formSchema}
      defaultValues={persistedData}
      noValidate
      action={pathname}
      onChange={(e) => {
        const target = e.target as HTMLInputElement;
        setPersistedData((prev) => ({
          ...prev,
          [target.name]: target.value,
        }));
      }}
      onSubmit={() => globalThis.localStorage.removeItem(`form-${pathname}`)}
    >
      {(form) => (
        <>
          <input type="hidden" name={CSRFKey} value={csrf} />
          <div className="ds-stack ds-stack-40">
            {inputFormElements}
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
