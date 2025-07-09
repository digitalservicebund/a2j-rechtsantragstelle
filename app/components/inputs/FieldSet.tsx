import { type StrapiFieldSet } from "~/services/cms/components/StrapiFieldSet";
import { keyFromElement } from "~/services/cms/keyFromElement";
import { FormComponent } from "../FormComponents";

type FieldSetProps = Readonly<
  Pick<StrapiFieldSet, "fieldSetGroup" | "heading">
>;

export const FieldSet = ({
  heading,
  fieldSetGroup: {
    data: {
      attributes: { formComponents },
    },
  },
}: FieldSetProps) => {
  return (
    <fieldset>
      <legend>{heading}</legend>
      {formComponents.map((componentProps) => (
        <div key={keyFromElement(componentProps)} className="pl-40 pt-16">
          <FormComponent componentProps={componentProps} />
        </div>
      ))}
    </fieldset>
  );
};
