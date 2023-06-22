import { z } from "zod";
import { yesNoStep } from "~/models/flows/createStep";
import type { FormPages } from "~/models/flows/steps";
import { buildAllValidators } from "~/models/flows/buildAllValidators";

export const formPages: FormPages = {
  kontaktaufnahme: yesNoStep("kontaktaufnahme"),
  "kontaktaufnahme-hinweis": {},
  fristAbgelaufen: {
    schema: z.object({ fristAbgelaufen: z.enum(["yes", "notSet", "no"]) }),
  },
  "frist-hinweis": {},
  verjaehrt: yesNoStep("verjaehrt"),
  "verjaehrt-hinweis": {},
  beweise: yesNoStep("beweise"),
  "beweise-hinweis": {},
} as const;

export const allValidators = buildAllValidators(formPages);
