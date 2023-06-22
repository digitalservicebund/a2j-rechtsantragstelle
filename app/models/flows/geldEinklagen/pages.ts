import { z } from "zod";
import { yesNoStep } from "~/models/flows/createStep";
import type { FormPages } from "~/models/flows/steps";
import { buildAllValidators } from "~/models/flows/buildAllValidators";

export const formPages: FormPages = {
  kontaktaufnahme: yesNoStep("kontaktaufnahme"),
  "kontaktaufnahme-hinweis": {},
  frist: { schema: z.object({ frist: z.enum(["yes", "yesExpired", "no"]) }) },
  "frist-hinweis": {},
  "vor-2020": yesNoStep("vor-2020"),
} as const;

export const allValidators = buildAllValidators(formPages);
