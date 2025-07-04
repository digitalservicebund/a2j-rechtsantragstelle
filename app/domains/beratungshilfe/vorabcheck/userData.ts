import { z } from "zod";
import { bereich } from "~/domains/beratungshilfe/formular/rechtsproblem/userData";
import { staatlicheLeistungenInputSchema } from "~/domains/shared/formular/finanzielleAngaben/userData";
import { buildKidsCountValidationSchema } from "~/services/validation/kidsCount/buildKidsCountValidationSchema";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";
import { kidsSchema } from "./kidsSchema";

export const beratungshilfeVorabcheckInputSchema = {
  rechtsschutzversicherung: YesNoAnswer,
  rsvCoverage: z.enum(
    ["yes", "partly", "tooExpensive", "no", "unknown"],
    customRequiredErrorMessage,
  ),
  klageEingereicht: YesNoAnswer,
  hamburgOderBremen: YesNoAnswer,
  beratungshilfeBeantragt: YesNoAnswer,
  eigeninitiative: YesNoAnswer,
  wurdeVerklagt: YesNoAnswer,
  bereich,
  staatlicheLeistungen: staatlicheLeistungenInputSchema,
  erwerbstaetigkeit: YesNoAnswer,
  vermoegen: z.enum(["below_10k", "above_10k"], customRequiredErrorMessage),
  genauigkeit: YesNoAnswer,
  partnerschaft: YesNoAnswer,
  einkommenPartner: buildMoneyValidationSchema(),
  kinder: YesNoAnswer,
  kinderKurz: YesNoAnswer,
  kids: kidsSchema,
  kinderAnzahlKurz: buildKidsCountValidationSchema(),
  einkommenKinder: buildMoneyValidationSchema(),
  unterhalt: YesNoAnswer,
  unterhaltSumme: buildMoneyValidationSchema(),
  einkommen: buildMoneyValidationSchema(),
  verfuegbaresEinkommen: YesNoAnswer,
  miete: buildMoneyValidationSchema(),
  weitereZahlungenSumme: buildMoneyValidationSchema(),
} as const;

const _partialSchema = z.object(beratungshilfeVorabcheckInputSchema).partial();
export type BeratungshilfeVorabcheckUserData = z.infer<typeof _partialSchema>;
