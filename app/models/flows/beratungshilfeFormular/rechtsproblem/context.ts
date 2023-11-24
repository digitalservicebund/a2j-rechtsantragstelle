import { z } from "zod";
import {
  YesNoAnswer,
  customRequiredErrorMessage,
} from "~/services/validation/YesNoAnswer";
import { inputRequiredSchema } from "~/services/validation/inputRequired";

export const beratungshilfeRechtsproblem = {
  bereich: z.enum(
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
  ),
  beschreibung: inputRequiredSchema,
  eigeninitiative: YesNoAnswer,
  eigeninitiativeBeschreibung: inputRequiredSchema,
  keineEigeninitiativeBeschreibung: inputRequiredSchema,
  sonstiges: z.string(),
};

const contextObject = z.object(beratungshilfeRechtsproblem).partial();
export type BeratungshilfeRechtsproblem = z.infer<typeof contextObject>;

export const beratungshilfeRechtsproblemGuards = {
  eigeninitiativeYes: (context: BeratungshilfeRechtsproblem) =>
    context.eigeninitiative === "yes",
};

export const rechtsproblemDone = (context: BeratungshilfeRechtsproblem) =>
  Boolean(
    context.bereich &&
      context.beschreibung &&
      context.eigeninitiative &&
      (context.eigeninitiativeBeschreibung ||
        context.keineEigeninitiativeBeschreibung),
  );
