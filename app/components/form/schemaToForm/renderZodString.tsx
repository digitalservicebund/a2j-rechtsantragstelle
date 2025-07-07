import get from "lodash/get";
import type { z } from "zod";
import Input from "~/components/inputs/Input";
import type { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";

export const isZodString = (
  fieldSchema: z.ZodTypeAny,
): fieldSchema is z.ZodString => fieldSchema._def.typeName === "ZodString";

export const renderZodString = (
  schema: z.ZodString,
  fieldName: string,
  matchingElement?: StrapiFormComponent,
) => (
  <Input
    key={fieldName}
    name={fieldName}
    type={get(matchingElement, "type")}
    label={get(matchingElement, "label")}
    suffix={get(matchingElement, "suffix")}
    placeholder={get(matchingElement, "placeholder")}
    width={get(matchingElement, "width")}
    errorMessages={get(matchingElement, "errorMessages")}
    helperText={get(matchingElement, "helperText")}
  />
);
