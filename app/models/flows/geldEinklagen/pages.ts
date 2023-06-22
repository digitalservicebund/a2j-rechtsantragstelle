import { z } from "zod";
import { yesNoStep } from "~/models/flows/createStep";
import type { FormPages } from "~/models/flows/FormPages";
import { buildAllValidators } from "~/models/flows/buildAllValidators";

export const formPages: FormPages = {
  kontaktaufnahme: yesNoStep("kontaktaufnahme"),
  "kontaktaufnahme-hinweis": {},
  frist: { schema: z.enum(["yes", "yesExpired", "no"]) },
} as const;

export const allValidators = buildAllValidators(formPages);
