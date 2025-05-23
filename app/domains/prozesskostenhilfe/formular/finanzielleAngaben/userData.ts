import { z } from "zod";
import { duplicateContext } from "~/domains/common";
import { finanzielleAngabenPartnerInputSchema } from "~/domains/shared/formular/finanzielleAngaben/partner/inputSchema";
import {
  besondereBelastungenInputSchema,
  bankkontenArraySchema,
  geldanlagenArraySchema,
  grundeigentumArraySchema,
  kinderArraySchema,
  kraftfahrzeugeArraySchema,
  unterhaltszahlungInputSchema,
  wertsachenArraySchema,
  financialEntryInputSchema,
  livingSituationInputSchema,
} from "~/domains/shared/formular/finanzielleAngaben/userData";
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
import type { ProzesskostenhilfeFinanzielleAngabenEinkuenfteUserData } from "./einkuenfte/userData";
import { prozesskostenhilfeFinanzielleAngabenEinkuenfteInputSchema } from "./einkuenfte/userData";

const optionalMoneyInputSchema = buildMoneyValidationSchema().or(z.literal(""));

export const zahlungspflichtigerInputSchema = z.enum(
  ["myself", "myselfAndPartner", "myselfAndSomeoneElse"],
  customRequiredErrorMessage,
);

export const prozesskostenhilfeFinanzielleAngabenInputSchema = {
  ...finanzielleAngabenPartnerInputSchema,
  ...duplicateContext(
    prozesskostenhilfeFinanzielleAngabenEinkuenfteInputSchema,
    "partner",
  ),
  "partner-receivesSupport": YesNoAnswer,
  "partner-supportAmount": buildMoneyValidationSchema(),
  partnerHasBesondersAusgaben: YesNoAnswer,
  partnerBesondersAusgabe: financialEntryInputSchema.pick({
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
  unterhaltszahlungen: z.array(unterhaltszahlungInputSchema),
  hasAusgaben: YesNoAnswer,
  besondereBelastungen: besondereBelastungenInputSchema,
  livingSituation: livingSituationInputSchema,
  apartmentSizeSqm: integerSchema,
  numberOfRooms: integerSchema,
  rentsApartment: YesNoAnswer,
  apartmentPersonCount: integerSchema,
  totalRent: buildMoneyValidationSchema(),
  rentWithoutUtilities: optionalMoneyInputSchema,
  sharedRent: buildMoneyValidationSchema(),
  utilitiesCost: optionalMoneyInputSchema,
  heatingCosts: optionalMoneyInputSchema,
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
        zahlungspflichtiger: zahlungspflichtigerInputSchema,
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
        zahlungspflichtiger: zahlungspflichtigerInputSchema,
        betragEigenerAnteil: buildMoneyValidationSchema().optional(),
        betragGesamt: buildMoneyValidationSchema(),
      })
      .partial(),
  ),
  pageData: pageDataSchema,
};

const _partialSchema = z
  .object(prozesskostenhilfeFinanzielleAngabenInputSchema)
  .partial();

export type PartnerEinkuenfteUserData = {
  [key in keyof ProzesskostenhilfeFinanzielleAngabenEinkuenfteUserData as `partner-${key}`]: ProzesskostenhilfeFinanzielleAngabenEinkuenfteUserData[key];
} & {
  "partner-receivesSupport"?: "yes" | "no";
  "partner-supportAmount"?: string;
  pageData?: {
    arrayIndexes: number[];
  };
};

export type ProzesskostenhilfeFinanzielleAngabenUserData = z.infer<
  typeof _partialSchema
> &
  ProzesskostenhilfeFinanzielleAngabenEinkuenfteUserData &
  PartnerEinkuenfteUserData;
