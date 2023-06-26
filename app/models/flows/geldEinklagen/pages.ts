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
  forderung: z.enum([
    "lessOrEqual5000",
    "moreThan5000",
    "action",
    "moneyAndAction",
    "unsure",
  ]),
  bereich: z.enum(["work", "living", "shopping", "family", "travel", "other"]),
  flug: YesNoAnswer,
} as const;

const contextObject = z.object(context).partial();
export type GeldEinklagenVorabcheckContext = z.infer<typeof contextObject>;
