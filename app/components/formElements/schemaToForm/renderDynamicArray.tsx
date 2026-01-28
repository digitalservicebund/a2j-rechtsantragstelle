import { DynamicArray } from "~/components/formElements/DynamicArray";
import { type StrapiDynamicArray } from "~/services/cms/models/formElements/StrapiDynamicArraySchema";
import { type StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";

export const getDynamicArrayByFieldName = (
  fieldName: string,
  formComponents: StrapiFormComponent[],
) => {
  return formComponents
    .filter(
      (formComponents) =>
        formComponents.__component === "form-elements.dynamic-array",
    )
    .find(({ name }) => name === fieldName);
};

export const renderDynamicArray = (props: StrapiDynamicArray) => {
  return <DynamicArray key={props.name} {...props} />;
};
