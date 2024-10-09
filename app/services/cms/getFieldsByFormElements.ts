import type { StrapiFormComponent } from "./models/StrapiFormComponent";

export const getFieldsByFormElements = (
  formElements: StrapiFormComponent[],
): string[] => {
  const fieldNamesWithoutFieldset = formElements
    .filter((element) => element.__component !== "form-elements.fieldset")
    .map((entry) => entry.name);

  const fieldNamesFieldset = formElements
    .filter((element) => element.__component === "form-elements.fieldset")
    .filter((element) => typeof element.fieldsetGroup !== "undefined")
    .flatMap((element) => element.fieldsetGroup.data.attributes.formComponents)
    .map((element) => element.name);

  return [...fieldNamesWithoutFieldset, ...fieldNamesFieldset];
};
