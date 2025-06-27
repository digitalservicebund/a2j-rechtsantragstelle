import { z } from "zod";
import { buildKidsCountValidationSchema } from "~/services/validation/kidsCount/buildKidsCountValidationSchema";

export const kidsSchema = z
  .object({
    kids6Below: buildKidsCountValidationSchema(),
    kids7To14: buildKidsCountValidationSchema(),
    kids15To18: buildKidsCountValidationSchema(),
    kids18Above: buildKidsCountValidationSchema(),
  })
  .superRefine((schema, ctx) => {
    const fieldnames = [
      "kids6Below",
      "kids7To14",
      "kids15To18",
      "kids18Above",
    ] as const;

    if (
      !fieldnames
        .map((fieldname) => schema[fieldname])
        .some((field) => field != "0" && field != undefined)
    ) {
      fieldnames.forEach((fieldname) => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "fill_one",
          path: [fieldname],
        });
      });
    }
  });
