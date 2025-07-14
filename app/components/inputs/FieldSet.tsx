import classNames from "classnames";
import { type StrapiFieldSet } from "~/services/cms/components/StrapiFieldSet";
import { keyFromElement } from "~/services/cms/keyFromElement";
import { FormComponent } from "../FormComponents";
import Image from "../Image";
import RichText from "../RichText";

type FieldSetProps = Readonly<
  Pick<StrapiFieldSet, "fieldSetGroup" | "heading" | "image">
>;

const IMAGE_HEIGHT = 24;
const IMAGE_WIDTH = 24;

export const FieldSet = ({
  heading,
  fieldSetGroup: { formComponents },
  image,
}: FieldSetProps) => {
  return (
    <fieldset>
      <legend className="md:flex md:gap-8">
        {image && (
          <Image
            {...image}
            height={IMAGE_HEIGHT}
            width={IMAGE_WIDTH}
            ariaHidden={true}
          />
        )}
        <RichText html={heading} />
      </legend>
      {formComponents.map((componentProps) => (
        <div
          key={keyFromElement(componentProps)}
          className={classNames("pt-16", { "md:pl-32": image })}
        >
          <FormComponent componentProps={componentProps} />
        </div>
      ))}
    </fieldset>
  );
};
