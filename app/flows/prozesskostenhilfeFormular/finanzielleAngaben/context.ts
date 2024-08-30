import { z } from "zod";
import {
  besondereBelastungenSchema,
  bankkontenArraySchema,
  eigentumTotalWorthSchema,
  gelanlagenArraySchema,
  grundeigentumArraySchema,
  kinderArraySchema,
  kraftfahrzeugeArraySchema,
  partnerschaftSchema,
  unterhaltszahlungSchema,
  wertsachenArraySchema,
} from "~/flows/shared/finanzielleAngaben/context";
import { pageDataSchema } from "~/services/flow/pageDataSchema";
import { createDateSchema } from "~/services/validation/date";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";

export const zahlungspflichtigerSchema = z.enum(
  ["myself", "myselfAndPartner", "myselfAndSomeoneElse"],
  customRequiredErrorMessage,
);

export const prozesskostenhilfeFinanzielleAngabenContext = {
  partnerschaft: partnerschaftSchema,
  zusammenleben: YesNoAnswer,
  unterhalt: YesNoAnswer,
  unterhaltsSumme: buildMoneyValidationSchema(),
  partnerEinkommen: YesNoAnswer,
  partnerEinkommenSumme: buildMoneyValidationSchema(),
  partnerVorname: stringRequiredSchema,
  partnerNachname: stringRequiredSchema,
  hasKinder: YesNoAnswer,
  kinder: kinderArraySchema,
  hasBankkonto: YesNoAnswer,
  bankkonten: bankkontenArraySchema,
  hasKraftfahrzeug: YesNoAnswer,
  kraftfahrzeuge: kraftfahrzeugeArraySchema,
  hasGeldanlage: YesNoAnswer,
  geldanlagen: gelanlagenArraySchema,
  eigentumTotalWorth: eigentumTotalWorthSchema,
  hasGrundeigentum: YesNoAnswer,
  grundeigentum: grundeigentumArraySchema,
  hasWertsache: YesNoAnswer,
  wertsachen: wertsachenArraySchema,
  hasWeitereUnterhaltszahlungen: YesNoAnswer,
  unterhaltszahlungen: z.array(unterhaltszahlungSchema),
  hasAusgaben: YesNoAnswer,
  besondereBelastungen: besondereBelastungenSchema,
  versicherungen: z.array(
    z.object({
      art: z.enum(
        [
          "haftpflichtversicherung",
          "hausratsversicherung",
          "unfallversicherung",
          "pivateKrankenzusatzversicherung",
          "kfzVersicherung",
          "sonstige",
        ],
        customRequiredErrorMessage,
      ),
      beitrag: buildMoneyValidationSchema(),
      sonstigeArt: stringOptionalSchema,
    }),
  ),
  ratenzahlungen: z.array(
    z.object({
      art: stringRequiredSchema,
      zahlungsempfaenger: stringRequiredSchema,
      zahlungspflichtiger: zahlungspflichtigerSchema,
      betragEigenerAnteil: buildMoneyValidationSchema(),
      betragGesamt: buildMoneyValidationSchema(),
      restschuld: buildMoneyValidationSchema(),
      laufzeitende: createDateSchema(),
    }),
  ),
  sonstigeAusgaben: z.array(
    z.object({
      art: stringRequiredSchema,
      zahlungsempfaenger: stringRequiredSchema,
      zahlungspflichtiger: zahlungspflichtigerSchema,
      betragEigenerAnteil: buildMoneyValidationSchema(),
      betragGesamt: buildMoneyValidationSchema(),
    }),
  ),
  pageData: pageDataSchema,
};

const _contextObject = z
  .object(prozesskostenhilfeFinanzielleAngabenContext)
  .partial();
export type ProzesskostenhilfeFinanzielleAngabenContext = z.infer<
  typeof _contextObject
>;
