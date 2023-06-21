import { z } from "zod";
import { emptyStep } from "~/components/form/steps/emptyStep";
import { yesNoStep } from "~/components/form/createStep";
import type { FormPages } from "~/models/flows/FormPages";
import { buildAllValidators } from "~/models/flows/buildAllValidators";

export const formPages: FormPages = {
  kontaktaufnahme: yesNoStep("kontaktaufnahme"),
  "kontaktaufnahme-hinweis": emptyStep,
  frist: { schema: z.enum(["yes", "yesExpired", "no"]) },
} as const;

export const allValidators = buildAllValidators(formPages);
