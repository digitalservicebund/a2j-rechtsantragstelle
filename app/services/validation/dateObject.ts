import z from "zod";
import { isValidDate } from "./dateString";

export const createSplitDateSchema = (args?: {
  earliest?: () => Date;
  latest?: () => Date;
}) => {
  if (args?.earliest && args?.latest && args.latest() <= args.earliest()) {
    throw new Error(
      `Latest valid ${args.latest().toDateString()} can't be before earliest valid ${args.earliest().toDateString()}`,
    );
  }

  const invalid_birthdate = "Bitte geben Sie ein gültiges Geburtsdatum ein.";
  const input_required = "Diese Felder müssen ausgefüllt werden.";

  return z
    .object({
      day: z
        .string({ message: input_required })
        .trim()
        .min(1, input_required)
        .refine(
          (val) => {
            const num = Number(val);
            return !Number.isNaN(num) && num >= 1 && num <= 31;
          },
          { message: invalid_birthdate },
        ),
      month: z
        .string({ message: input_required })
        .trim()
        .min(1, input_required)
        .refine(
          (val) => {
            const num = Number(val);
            return !Number.isNaN(num) && num >= 1 && num <= 12;
          },
          { message: invalid_birthdate },
        ),
      year: z
        .string({ message: input_required })
        .trim()
        .min(1, input_required)
        .refine(
          (val) => {
            const num = Number(val);
            return !Number.isNaN(num);
          },
          { message: invalid_birthdate },
        )
        .refine((val) => Number(val) >= 1900, {
          message: "Geburtsdatum älter als 150 Jahre ist nicht relevant.",
        })
        .refine((val) => Number(val) <= Number(new Date().getFullYear()), {
          message: "Geburtsdatum muss in der Vergangenheit liegen.",
        }),
    })
    .superRefine((data, ctx) => {
      if (
        !isValidDate(
          toDateString(Number(data.day), Number(data.month), Number(data.year)),
        )
      ) {
        ctx.addIssue({
          code: "custom",
          message: invalid_birthdate,
          path: ["geburtsdatum"],
          fatal: false,
        });
      }
    })
    .meta({ description: "split_date" });
};
export const toDateString = (day?: number, month?: number, year?: number) =>
  `${String(day).padStart(2, "0")}.${String(month).padStart(2, "0")}.${year}`;
