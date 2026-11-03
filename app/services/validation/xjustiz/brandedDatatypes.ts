import {
  datatypeA,
  datatypeB,
  datatypeC,
  datatypeD,
} from "@digitalservicebund/a2j-xjustiz-bridge/nachricht/zahlungsklage";
import z from "zod";

type ParseResult<Output> =
  | { readonly value: Output; readonly issues?: undefined }
  | { readonly issues: ReadonlyArray<{ readonly message: string }> };

// Turns an xJustiz datatype into a zod schema that outputs its branded type.
// The datatypes accept empty strings, so min(1) makes the field required.
const branded = <Output>(parse: (value: string) => ParseResult<Output>) =>
  z
    .string()
    .min(1)
    .transform((value, ctx) => {
      const result = parse(value);
      if (!result.issues) return result.value;
      result.issues.forEach((issue) => ctx.addIssue(issue.message));
      return z.NEVER;
    });

export const typeA = branded(datatypeA);
export const typeB = branded(datatypeB);
export const typeC = branded(datatypeC);
export const typeD = branded(datatypeD);
export const optionalTypeC = z.preprocess(
  (value) => (value === "" ? undefined : value),
  typeC.optional(),
);
