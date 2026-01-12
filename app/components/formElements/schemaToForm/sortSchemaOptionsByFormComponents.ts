import type { z } from "zod";
import { type StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";

type ZodEnum = z.ZodEnum<Record<string, string>>;

type OptionBasedComponent =
  | "form-elements.dropdown"
  | "form-elements.select"
  | "form-elements.tile-group";

const isOptionBasedComponent = (
  component?: StrapiFormComponent,
): component is StrapiFormComponent & {
  __component: OptionBasedComponent;
  options: Array<{ value: string }>;
} => {
  return (
    !!component &&
    (component.__component === "form-elements.dropdown" ||
      component.__component === "form-elements.select" ||
      component.__component === "form-elements.tile-group")
  );
};

export const sortSchemaOptionsByFormComponents = (
  schema: ZodEnum,
  formComponent?: StrapiFormComponent,
) => {
  if (!isOptionBasedComponent(formComponent)) {
    return schema.options;
  }

  const orderIndex = new Map(
    formComponent.options.map(({ value }, index) => [value, index]),
  );

  return [...schema.options].sort((a, b) => {
    const indexA = orderIndex.get(a);
    const indexB = orderIndex.get(b);

    if (indexA === undefined && indexB === undefined) return 0;
    if (indexA === undefined) return 1;
    if (indexB === undefined) return -1;

    return indexA - indexB;
  });
};
