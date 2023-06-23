import { z } from "zod";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const context = {
  kontaktaufnahme: YesNoAnswer,
  fristAbgelaufen: z.enum(["yes", "notSet", "no"]),
  verjaehrt: YesNoAnswer,
  beweise: YesNoAnswer,
  gerichtsentscheidung: YesNoAnswer,
  verfahrenBegonnen: YesNoAnswer,
  privatperson: z.enum([
    "yes",
    "nonPrivate",
    "nonSingle",
    "representing",
    "organisation",
  ]),
  wohnsitzDeutschland: YesNoAnswer,
} as const;

const contextObject = z.object(context).partial();
export type GeldEinklagenVorabcheckContext = z.infer<typeof contextObject>;
