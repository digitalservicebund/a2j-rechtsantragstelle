import { z } from "zod";
import { duplicateContext } from "~/flows/common";
import {
  besondereBelastungenSchema,
  bankkontenArraySchema,
  gelanlagenArraySchema,
  grundeigentumArraySchema,
  kinderArraySchema,
  kraftfahrzeugeArraySchema,
  unterhaltszahlungSchema,
  wertsachenArraySchema,
  financialEntrySchema,
} from "~/flows/shared/finanzielleAngaben/context";
import {
  finanzielleAngabenPartnerContext,
  type FinanzielleAngabenPartnerContext,
} from "~/flows/shared/finanzielleAngaben/partner/context";
import { pageDataSchema } from "~/services/flow/pageDataSchema";
import { createDateSchema } from "~/services/validation/date";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";
import { today } from "~/util/date";
import type { ProzesskostenhilfeFinanzielleAngabenEinkuenfteContext } from "./einkuenfte/context";
import { prozesskostenhilfeFinanzielleAngabenEinkuenfteContext } from "./einkuenfte/context";

export const zahlungspflichtigerSchema = z.enum(
  ["myself", "myselfAndPartner", "myselfAndSomeoneElse"],
  customRequiredErrorMessage,
);

export const prozesskostenhilfeFinanzielleAngabenContext = {
  ...finanzielleAngabenPartnerContext,
  ...duplicateContext(
    prozesskostenhilfeFinanzielleAngabenEinkuenfteContext,
    "partner",
  ),
  partnerHasBesondersAusgaben: YesNoAnswer,
  partnerBesondersAusgabe: financialEntrySchema.pick({
    beschreibung: true,
    betrag: true,
  }),
  hasKinder: YesNoAnswer,
  kinder: kinderArraySchema,
  hasBankkonto: YesNoAnswer,
  bankkonten: bankkontenArraySchema,
  hasKraftfahrzeug: YesNoAnswer,
  kraftfahrzeuge: kraftfahrzeugeArraySchema,
  hasGeldanlage: YesNoAnswer,
  geldanlagen: gelanlagenArraySchema,
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
      laufzeitende: createDateSchema({
        earliest: () => today(),
      }),
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

export type PartnerEinkuenfteContext = {
  [key in keyof ProzesskostenhilfeFinanzielleAngabenEinkuenfteContext as `partner-${key}`]: ProzesskostenhilfeFinanzielleAngabenEinkuenfteContext[key];
} & {
  pageData?: {
    arrayIndexes: number[];
  };
};

export type ProzesskostenhilfeFinanzielleAngabenContext = z.infer<
  typeof _contextObject
> &
  FinanzielleAngabenPartnerContext &
  ProzesskostenhilfeFinanzielleAngabenEinkuenfteContext &
  PartnerEinkuenfteContext;
