import { z } from "zod";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { customRequiredErrorMessage } from "~/services/validation/YesNoAnswer";
import type { GenericGuard } from "../../guards.server";

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

export const beratungshilfeRechtsproblem = {
  bereich,
  gegenseite: stringRequiredSchema,
  beschreibung: stringRequiredSchema,
  ziel: stringRequiredSchema,
  eigeninitiativeBeschreibung: stringRequiredSchema,
};

const _contextObject = z.object(beratungshilfeRechtsproblem).partial();
export type BeratungshilfeRechtsproblem = z.infer<typeof _contextObject>;

export const rechtsproblemDone: GenericGuard<BeratungshilfeRechtsproblem> = ({
  context,
}) =>
  Boolean(
    context.bereich &&
      context.gegenseite &&
      context.beschreibung &&
      context.ziel &&
      context.eigeninitiativeBeschreibung,
  );
