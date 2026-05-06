import { useLocation } from "react-router";
import { type StrapiFieldSet } from "~/services/cms/models/formElements/StrapiFieldSet";
import Image from "~/components/common/Image.tsx";
import classNames from "classnames";
import { getPageSchema } from "~/domains/pageSchemas";
import { SchemaComponents } from "~/components/formElements/SchemaComponents";
import RichText from "../../RichText";

type FieldsetProps = Readonly<
  Pick<StrapiFieldSet, "heading" | "image"> & {
    formComponents: StrapiFieldSet["fieldSetGroup"]["formComponents"];
    readOnlyFieldNames: string[];
  }
>;

const IMAGE_HEIGHT = 24;
const IMAGE_WIDTH = 24;

const getFieldSetPageSchema = (
  pathname: string,
  formComponents: StrapiFieldSet["fieldSetGroup"]["formComponents"],
) => {
  const pageSchema = getPageSchema(pathname);

  return pageSchema
    ? Object.fromEntries(
        Object.entries(pageSchema).filter(([key]) =>
          formComponents.some((fc) => fc.name === key),
        ),
      )
    : null;
};

export const Fieldset = ({
  heading,
  formComponents,
  image,
  readOnlyFieldNames,
}: FieldsetProps) => {
  const { pathname } = useLocation();

  const pageSchema = getFieldSetPageSchema(pathname, formComponents);

  if (!pageSchema) return null;

  return (
    <fieldset className="kern-fieldset">
      <legend className="flex gap-kern-space-small items-center m-0! p-0!">
        {image && (
          <Image
            {...image}
            height={IMAGE_HEIGHT}
            width={IMAGE_WIDTH}
            ariaHidden={true}
            className="min-h-full min-w-[26px] forced-color-adjust-auto"
          />
        )}
        <RichText
          html={heading}
          className="text-kern-adaptive-medium! kern-label"
        />
      </legend>
      <div className="kern-fieldset__body">
        <SchemaComponents
          pageSchema={pageSchema}
          formComponents={formComponents}
          className={classNames("pt-16", { "md:pl-32": image })}
          readOnlyFieldNames={readOnlyFieldNames}
        />
      </div>
    </fieldset>
  );
};
