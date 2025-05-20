import { z } from "zod";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { customRequiredErrorMessage } from "~/services/validation/YesNoAnswer";
import type { GenericGuard } from "../../../guards.server";

export const bereich = z.enum(
  [
    "authorities",
    "living",
    "work",
    "separation",
    "trade",
    "debt",
    "inheritance",
    "criminalProcedure",
    "other",
  ],
  customRequiredErrorMessage,
);

export const beratungshilfeRechtsproblemInputSchema = {
  bereich,
  gegenseite: stringRequiredSchema,
  beschreibung: stringRequiredSchema,
  ziel: stringRequiredSchema,
  eigeninitiativeBeschreibung: stringRequiredSchema,
};

const _partialSchema = z.object(beratungshilfeRechtsproblemInputSchema).partial();
export type BeratungshilfeRechtsproblemUserData = z.infer<typeof _partialSchema>;

export const rechtsproblemDone: GenericGuard<BeratungshilfeRechtsproblemUserData> = ({
  context,
}) =>
  Boolean(
    context.bereich &&
      context.gegenseite &&
      context.beschreibung &&
      context.ziel &&
      context.eigeninitiativeBeschreibung,
  );
