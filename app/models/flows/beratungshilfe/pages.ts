import { z } from "zod";
import { buildKidsCountValidationSchema } from "~/services/validation/kidsCount/buildKidsCountValidationSchema";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";

export const context = {
  rechtsschutzversicherung: YesNoAnswer,
  klageEingereicht: YesNoAnswer,
  hamburgOderBremen: YesNoAnswer,
  beratungshilfeBeantragt: YesNoAnswer,
  eigeninitiative: YesNoAnswer,
  wurdeVerklagt: YesNoAnswer,
  staatlicheLeistungen: z.enum([
    "grundsicherung",
    "asylbewerberleistungen",
    "buergergeld",
    "keine",
  ]),
  erwerbstaetigkeit: YesNoAnswer,
  vermoegen: z.enum(["below_10k", "above_10k"]),
  genauigkeit: YesNoAnswer,
  partnerschaft: YesNoAnswer,
  einkommenPartner: buildMoneyValidationSchema(),
  kinder: YesNoAnswer,
  kinderKurz: YesNoAnswer,
  kids6Below: buildKidsCountValidationSchema(),
  kids7To14: buildKidsCountValidationSchema(),
  kids15To18: buildKidsCountValidationSchema(),
  kids18Above: buildKidsCountValidationSchema(),
  kinderAnzahlKurz: buildKidsCountValidationSchema(),
  einkommenKinder: buildMoneyValidationSchema(),
  unterhalt: YesNoAnswer,
  unterhaltSumme: buildMoneyValidationSchema(),
  einkommen: buildMoneyValidationSchema(),
  verfuegbaresEinkommen: YesNoAnswer,
  miete: buildMoneyValidationSchema(),
  weitereZahlungenSumme: buildMoneyValidationSchema(),
} as const;

const contextObject = z.object(context).partial();
export type BeratungshilfeVorabcheckContext = z.infer<typeof contextObject>;
