import { useLocation } from "react-router";
import { type StrapiFieldSet } from "~/services/cms/models/formElements/StrapiFieldSet";
import Image from "~/components/common/Image.tsx";
import classNames from "classnames";
import { getPageSchema } from "~/domains/pageSchemas";
import { SchemaComponents } from "~/components/formElements/SchemaComponents";
import RichText from "../../../common/RichText";

type FieldsetProps = Readonly<
  Pick<StrapiFieldSet, "heading" | "image" | "helperText"> & {
    formComponents: StrapiFieldSet["fieldSetGroup"]["formComponents"];
    readOnlyFieldNames: string[];
    isStorybook?: boolean;
  }
>;

const IMAGE_HEIGHT = 24;
const IMAGE_WIDTH = 24;
const PATHNAME_FOR_STORYBOOK =
  "/fluggastrechte/formular/flugdaten/geplanter-flug";

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
  helperText,
  readOnlyFieldNames,
  isStorybook = false,
}: FieldsetProps) => {
  const { pathname } = useLocation();

  const pageSchema = getFieldSetPageSchema(
    isStorybook ? PATHNAME_FOR_STORYBOOK : pathname, // workaround to render the Fieldset in Storybook, because useLocation returns "/" in Storybook
    formComponents,
  );

  const hasHelperText = !!helperText;
  const helperTextId = `fieldset-helper-text-${formComponents[0].id}`;

  if (!pageSchema) return null;

  return (
    <fieldset
      className="kern-fieldset"
      aria-describedby={hasHelperText ? helperTextId : undefined}
    >
      <legend className="flex gap-kern-space-small items-center m-0! p-0!">
        {image && (
          <Image
            {...image}
            height={IMAGE_HEIGHT}
            width={IMAGE_WIDTH}
            ariaHidden={true}
            className="min-h-full min-w-[26px]"
          />
        )}
        <RichText
          html={heading}
          className="text-kern-adaptive-medium! kern-label"
        />
      </legend>
      {hasHelperText && (
        <div
          className={classNames("kern-hint", { "md:pl-32!": image })}
          id={helperTextId}
        >
          {helperText}
        </div>
      )}
      <div className="kern-fieldset__body">
        <SchemaComponents
          pageConfig={{ pageSchema }}
          formComponents={formComponents}
          className={classNames("pt-16", { "md:pl-32": image })}
          readOnlyFieldNames={readOnlyFieldNames}
        />
      </div>
    </fieldset>
  );
};
