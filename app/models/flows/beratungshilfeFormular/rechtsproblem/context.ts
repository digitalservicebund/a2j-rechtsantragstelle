import { z } from "zod";
import {
  YesNoAnswer,
  customRequiredErrorMessage,
} from "~/services/validation/YesNoAnswer";
import { inputRequiredSchema } from "~/services/validation/inputRequired";
import type { Guards } from "../../guards.server";

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

//TODO: what was the reason of the duplication below
export const beratungshilfeRechtsproblem = {
  bereich,
  beschreibung: inputRequiredSchema,
  eigeninitiative: YesNoAnswer,
  eigeninitiativeBeschreibung: inputRequiredSchema,
  keineEigeninitiativeBeschreibung: inputRequiredSchema,
  sonstiges: z.string(),
};

const contextObject = z.object(beratungshilfeRechtsproblem).partial();
export type BeratungshilfeRechtsproblem = z.infer<typeof contextObject>;

export const beratungshilfeRechtsproblemGuards = {
  eigeninitiativeYes: ({ context }) => context.eigeninitiative === "yes",
} satisfies Guards;

export const rechtsproblemDone = (context: BeratungshilfeRechtsproblem) =>
  Boolean(
    context.bereich &&
      context.beschreibung &&
      context.eigeninitiative &&
      (context.eigeninitiativeBeschreibung ||
        context.keineEigeninitiativeBeschreibung),
  );
