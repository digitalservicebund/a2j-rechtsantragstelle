import {
  DynamicArray,
  type DynamicArrayProps,
} from "~/components/formElements/DynamicArray";
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

export const renderDynamicArray = ({
  fieldName,
  ...props
}: DynamicArrayProps) => {
  return <DynamicArray key={fieldName} fieldName={fieldName} {...props} />;
};
