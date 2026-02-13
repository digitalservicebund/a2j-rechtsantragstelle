import { useLocation } from "react-router";
import { type StrapiFieldSet } from "~/services/cms/models/formElements/StrapiFieldSet";
import KernRichText from "../KernRichText";
import Image from "../../common/Image";
import classNames from "classnames";
import { getPageSchema } from "~/domains/pageSchemas";
import { KernSchemaComponents } from "~/components/kernFormElements/KernSchemaComponents";

type KernFieldsetProps = Readonly<
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

export const KernFieldset = ({
  heading,
  formComponents,
  image,
}: KernFieldsetProps) => {
  const { pathname } = useLocation();

  const pageSchema = getFieldSetPageSchema(pathname, formComponents);

  if (!pageSchema) return null;

  return (
    <fieldset className="kern-fieldset">
      <legend className="kern-label kern-label--large">
        {image && (
          <Image
            {...image}
            height={IMAGE_HEIGHT}
            width={IMAGE_WIDTH}
            ariaHidden={true}
            className="min-h-full min-w-[24px]"
          />
        )}
        <KernRichText html={heading} />
      </legend>
      <div className="kern-fieldset__body">
        <KernSchemaComponents
          pageSchema={pageSchema}
          formComponents={formComponents}
          className={classNames("pt-16", { "md:pl-32": image })}
          showKernUX={false}
        />
      </div>
    </fieldset>
  );
};
