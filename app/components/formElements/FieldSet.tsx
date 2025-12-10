import classNames from "classnames";
import type { StrapiFieldSet } from "~/services/cms/models/formElements/StrapiFieldSet";
import Image from "../common/Image";
import RichText from "../common/RichText";
import { SchemaComponents } from "./SchemaComponents";
import { useLocation } from "react-router";
import { getPageSchema } from "~/domains/pageSchemas";

type FieldSetProps = Readonly<
  Pick<StrapiFieldSet, "heading" | "image"> & {
    formComponents: StrapiFieldSet["fieldSetGroup"]["formComponents"];
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

export const FieldSet = ({ heading, formComponents, image }: FieldSetProps) => {
  const { pathname } = useLocation();

  const pageSchema = getFieldSetPageSchema(pathname, formComponents);

  if (!pageSchema) return null;

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
      <SchemaComponents
        pageSchema={pageSchema}
        formComponents={formComponents}
        className={classNames("pt-16 !ds-stack-16", { "md:pl-32": image })}
      />
    </fieldset>
  );
};
