import { datatypeC as originalDatatypeC } from "@digitalservicebund/a2j-xjustiz-bridge/nachricht/zahlungsklage";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { z } from "zod";
import { translations } from "~/services/translations/translations";

const invalidCharacters = (characters: Readonly<Set<string>>) =>
  `${translations.xjustiz.invalidCharacters.de} ${[...characters].join(", ")}`;

/**
 * While Zod supports Standard Schemas natively, it doesn't allow them to be used
 * with operators like `and` or `pipe`. For example,
 * `someZodSchema.pipe(someStandardSchema)` is not allowed. This function takes
 * a Standard Schema and constructs a fully integrated Zod schema from it.
 * Doing so, it takes into account possible input to output transformations by
 * the validation function of the Standard Schema.
 */
function convertStandardSchemaToZod<Input, Output>(
  schema: StandardSchemaV1<Input, Output>,
): z.ZodType<Output, Input> {
  return z.any().transform((input, context) => {
    const result = schema["~standard"].validate(input);

    if (result instanceof Promise)
      throw new Error("Asynchronous schemas are not supported");

    if (result.issues) {
      result.issues?.forEach((issue) => context.addIssue(issue.message));
      return z.NEVER;
    } else {
      return result.value;
    }
  });
}

export const datatypeC = convertStandardSchemaToZod(
  originalDatatypeC.customize({ invalidCharacters }),
);
