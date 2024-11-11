import { z } from "zod";
import { duplicateContext } from "~/domains/common";
import {
  besondereBelastungenSchema,
  bankkontenArraySchema,
  geldanlagenArraySchema,
  grundeigentumArraySchema,
  kinderArraySchema,
  kraftfahrzeugeArraySchema,
  unterhaltszahlungSchema,
  wertsachenArraySchema,
  financialEntrySchema,
  livingSituationSchema,
} from "~/domains/shared/formular/finanzielleAngaben/context";
import { finanzielleAngabenPartnerContext } from "~/domains/shared/formular/finanzielleAngaben/partner/context";
import { pageDataSchema } from "~/services/flow/pageDataSchema";
import { createDateSchema } from "~/services/validation/date";
import { integerSchema } from "~/services/validation/integer";
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

const optionalMoneySchema = buildMoneyValidationSchema().or(z.literal(""));

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
  "partner-receivesSupport": YesNoAnswer,
  "partner-supportAmount": buildMoneyValidationSchema(),
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
  geldanlagen: geldanlagenArraySchema,
  hasGrundeigentum: YesNoAnswer,
  grundeigentum: grundeigentumArraySchema,
  hasWertsache: YesNoAnswer,
  wertsachen: wertsachenArraySchema,
  hasWeitereUnterhaltszahlungen: YesNoAnswer,
  unterhaltszahlungen: z.array(unterhaltszahlungSchema),
  hasAusgaben: YesNoAnswer,
  besondereBelastungen: besondereBelastungenSchema,
  livingSituation: livingSituationSchema,
  apartmentSizeSqm: integerSchema,
  numberOfRooms: integerSchema,
  rentsApartment: YesNoAnswer,
  apartmentPersonCount: integerSchema,
  totalRent: buildMoneyValidationSchema(),
  rentWithoutUtilities: optionalMoneySchema,
  sharedRent: buildMoneyValidationSchema(),
  utilitiesCost: optionalMoneySchema,
  heatingCosts: optionalMoneySchema,
  utilitiesCostOwned: buildMoneyValidationSchema(),
  heatingCostsOwned: buildMoneyValidationSchema(),
  utilitiesCostOwnShared: buildMoneyValidationSchema(),
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
    z
      .object({
        art: stringRequiredSchema,
        zahlungsempfaenger: stringRequiredSchema,
        zahlungspflichtiger: zahlungspflichtigerSchema,
        betragEigenerAnteil: buildMoneyValidationSchema().optional(),
        betragGesamt: buildMoneyValidationSchema(),
        restschuld: buildMoneyValidationSchema(),
        laufzeitende: createDateSchema({
          earliest: () => today(),
        }),
      })
      .partial(),
  ),
  sonstigeAusgaben: z.array(
    z
      .object({
        art: stringRequiredSchema,
        zahlungsempfaenger: stringRequiredSchema,
        zahlungspflichtiger: zahlungspflichtigerSchema,
        betragEigenerAnteil: buildMoneyValidationSchema().optional(),
        betragGesamt: buildMoneyValidationSchema(),
      })
      .partial(),
  ),
  pageData: pageDataSchema,
};

const _contextObject = z
  .object(prozesskostenhilfeFinanzielleAngabenContext)
  .partial();

export type PartnerEinkuenfteContext = {
  [key in keyof ProzesskostenhilfeFinanzielleAngabenEinkuenfteContext as `partner-${key}`]: ProzesskostenhilfeFinanzielleAngabenEinkuenfteContext[key];
} & {
  "partner-receivesSupport"?: "yes" | "no";
  "partner-supportAmount"?: string;
  pageData?: {
    arrayIndexes: number[];
  };
};

export type ProzesskostenhilfeFinanzielleAngabenContext = z.infer<
  typeof _contextObject
> &
  ProzesskostenhilfeFinanzielleAngabenEinkuenfteContext &
  PartnerEinkuenfteContext;
