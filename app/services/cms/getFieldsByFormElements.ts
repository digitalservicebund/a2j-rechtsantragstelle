import type { StrapiFormComponent } from "./models/formElements/StrapiFormComponent";

export const getFieldsByFormElements = (
  formElements: StrapiFormComponent[],
): string[] =>
  formElements.flatMap((element) =>
    element.__component === "form-elements.fieldset"
      ? getFieldsByFormElements(element.fieldSetGroup.formComponents)
      : element.name,
  );
