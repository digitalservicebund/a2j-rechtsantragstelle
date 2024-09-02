import type { StrapiFieldset } from "~/services/cms/components/StrapiFieldset";
import { FormComponent } from "~/services/cms/components/StrapiFormComponents";
import { keyFromElement } from "~/services/cms/keyFromElement";
import type { StrapiFieldsetGroups } from "~/services/cms/models/StrapiFieldsetGroups";

export type FieldsetProps = Readonly<
  Pick<StrapiFieldset, "heading"> & Pick<StrapiFieldsetGroups, "formComponents">
>;

export const Fieldset = ({ heading, formComponents }: FieldsetProps) => {
  return (
    <fieldset>
      <legend>{heading}</legend>
      {formComponents.map((el) => (
        <div key={keyFromElement(el)} className="pl-40 pt-16">
          <FormComponent component={el} />
        </div>
      ))}
    </fieldset>
  );
};
