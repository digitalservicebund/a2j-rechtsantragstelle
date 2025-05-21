import { z } from "zod";
import { bereich } from "~/domains/beratungshilfe/formular/rechtsproblem/userData";
import { rsvCoverage } from "~/domains/prozesskostenhilfe/formular/rechtsschutzversicherung/context";
import { staatlicheLeistungenInputSchema } from "~/domains/shared/formular/finanzielleAngaben/userData";
import { buildKidsCountValidationSchema } from "~/services/validation/kidsCount/buildKidsCountValidationSchema";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";

export const kidsSchema = z
  .object({
    kids6Below: buildKidsCountValidationSchema(),
    kids7To14: buildKidsCountValidationSchema(),
    kids15To18: buildKidsCountValidationSchema(),
    kids18Above: buildKidsCountValidationSchema(),
  })
  .superRefine((schema, ctx) => {
    const fieldnames = [
      "kids6Below",
      "kids7To14",
      "kids15To18",
      "kids18Above",
    ] as const;

    if (
      !fieldnames
        .map((fieldname) => schema[fieldname])
        .some((field) => field != "0" && field != undefined)
    ) {
      fieldnames.forEach((fieldname) => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "fill_one",
          path: [fieldname],
        });
      });
    }
  });

export const beratungshilfeVorabcheckInputSchema = {
  rechtsschutzversicherung: YesNoAnswer,
  rsvCoverage: z.union([
    rsvCoverage,
    z.enum(["tooExpensive"], customRequiredErrorMessage),
  ]),
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
