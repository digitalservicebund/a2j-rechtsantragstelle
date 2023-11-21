import { z } from "zod";
import {
  YesNoAnswer,
  customRequiredErrorMessage,
} from "~/services/validation/YesNoAnswer";

export const beratungshilfeRechtsproblem = {
  rechtsschutzversicherung: YesNoAnswer,
  wurdeVerklagt: YesNoAnswer,
  klageEingereicht: YesNoAnswer,
  beratungshilfeBeantragt: YesNoAnswer,
  bereich: z.enum(
    [
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
  beschreibung: z.string().min(3),
  eigeninitiative: YesNoAnswer,
  eigeninitiativeBeschreibung: z.string().min(3),
  keineEigeninitiativeBeschreibung: z.string().min(3),
  sonstiges: z.string(),
};

const contextObject = z.object(beratungshilfeRechtsproblem).partial();
type BeratungshilfeRechtsproblem = z.infer<typeof contextObject>;

export const beratungshilfeRechtsproblemGuards = {
  eigeninitiativeYes: (context: BeratungshilfeRechtsproblem) =>
    context.eigeninitiative === "yes",
};
