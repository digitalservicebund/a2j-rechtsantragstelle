import { z } from "zod";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { staatlicheLeistungen } from "../../beratungshilfe/context";
import {
  YesNoAnswer,
  customRequiredErrorMessage,
} from "~/services/validation/YesNoAnswer";
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import { inputRequiredSchema } from "~/services/validation/inputRequired";
import { postcodeSchema } from "~/services/validation/postcode";
import { addDays, createDateSchema, today } from "~/services/validation/date";
import { pageDataSchema } from "~/services/flow/pageData";
import { integerSchema } from "~/services/validation/integer";

const Eigentuemer = z.enum(
  ["myself", "partner", "myselfAndPartner", "myselfAndSomeoneElse"],
  customRequiredErrorMessage,
);

const GrundeigentumArt = z.enum(
  [
    "apartment",
    "houseForFamily",
    "houseWithMultipleApartments",
    "property",
    "hereditaryBuildingLaw",
  ],
  customRequiredErrorMessage,
);

export const beratungshilfeFinanzielleAngaben = {
  einkommen: buildMoneyValidationSchema(),
  erwerbstaetig: YesNoAnswer,
  staatlicheLeistungen,
  berufart: z.object({
    selbststaendig: checkedOptional,
    festangestellt: checkedOptional,
  }),
  weitereseinkommen: z.object({
    unterhaltszahlungen: checkedOptional,
    arbeitlosengeld: checkedOptional,
    wohngeld: checkedOptional,
    kindergeld: checkedOptional,
    bafoeg: checkedOptional,
    krankengeld: checkedOptional,
    rente: checkedOptional,
    elterngeld: checkedOptional,
    insolvenzgeld: checkedOptional,
    ueberbrueckungsgeld: checkedOptional,
    others: checkedOptional,
  }),
  berufsituation: z.enum(
    ["pupil", "student", "retiree", "no"],
    customRequiredErrorMessage,
  ),
  partnerschaft: z.enum(
    ["yes", "no", "separated", "widowed"],
    customRequiredErrorMessage,
  ),
  zusammenleben: YesNoAnswer,
  unterhalt: YesNoAnswer,
  unterhaltsSumme: buildMoneyValidationSchema(),
  partnerEinkommen: YesNoAnswer,
  partnerEinkommenSumme: buildMoneyValidationSchema(),
  partnerVorname: inputRequiredSchema,
  partnerNachname: inputRequiredSchema,
  hasKinder: YesNoAnswer,
  kinder: z.array(
    z.object({
      vorname: inputRequiredSchema,
      nachname: inputRequiredSchema,
      geburtsdatum: createDateSchema({
        earliest: () => addDays(today(), -24 * 365),
        latest: () => today(),
      }),
      wohnortBeiAntragsteller: z.enum(["yes", "no", "partially"]),
      eigeneEinnahmen: YesNoAnswer,
      einnahmen: buildMoneyValidationSchema(),
      unterhalt: YesNoAnswer,
      unterhaltsSumme: buildMoneyValidationSchema(),
    }),
  ),
  hasBankkonto: YesNoAnswer,
  bankkonten: z.array(
    z.object({
      bankName: inputRequiredSchema,
      kontostand: buildMoneyValidationSchema({}),
      iban: z.string(),
      kontoEigentuemer: Eigentuemer,
    }),
  ),
  hasKraftfahrzeug: YesNoAnswer,
  kraftfahrzeuge: z.array(
    z.object({
      art: inputRequiredSchema,
      marke: inputRequiredSchema,
      eigentuemer: Eigentuemer,
      verkaufswert: buildMoneyValidationSchema(),
      kilometerstand: inputRequiredSchema,
      anschaffungsjahr: z.string(),
      baujahr: inputRequiredSchema,
      bemerkung: inputRequiredSchema,
      arbeitsweg: inputRequiredSchema,
    }),
  ),
  hasGeldanlage: YesNoAnswer,
  geldanlagen: z.array(
    z.object({
      art: z.enum(
        [
          "bargeld",
          "wertpapiere",
          "guthabenkontoKrypto",
          "giroTagesgeldSparkonto",
          "befristet",
          "forderung",
          "sonstiges",
        ],
        customRequiredErrorMessage,
      ),
      eigentuemer: Eigentuemer,
      wert: buildMoneyValidationSchema(),

      kontoBankName: inputRequiredSchema.optional(),
      kontoIban: z.string().optional(),
      kontoBezeichnung: z.string().optional(),

      befristetArt: z
        .enum(
          ["lifeInsurance", "buildingSavingsContract", "fixedDepositAccount"],
          customRequiredErrorMessage,
        )
        .optional(),

      forderung: inputRequiredSchema.optional(),
      verwendungszweck: inputRequiredSchema.optional(),
      auszahlungdatum: inputRequiredSchema.optional(),
    }),
  ),
  besitzTotalWorth: z.enum(
    ["less10000", "more10000", "unsure"],
    customRequiredErrorMessage,
  ),
  hasGrundeigentum: YesNoAnswer,
  grundeigentum: z.array(
    z.object({
      istBewohnt: z.enum(["yes", "family", "no"], customRequiredErrorMessage),
      art: GrundeigentumArt,
      eigentuemer: Eigentuemer,
      flaeche: inputRequiredSchema,
      verkaufswert: buildMoneyValidationSchema(),
      strassehausnummer: inputRequiredSchema,
      plz: postcodeSchema,
      ort: inputRequiredSchema,
      land: inputRequiredSchema,
    }),
  ),
  hasWertsache: YesNoAnswer,
  wertsachen: z.array(
    z.object({
      art: inputRequiredSchema,
      eigentuemer: Eigentuemer,
      wert: buildMoneyValidationSchema(),
    }),
  ),
  livingSituation: z.enum(["alone", "withRelatives", "withOthers"]),
  apartmentSizeSqm: integerSchema,
  apartmentPersonCount: integerSchema,
  apartmentCostOwnShare: buildMoneyValidationSchema(),
  apartmentCostFull: buildMoneyValidationSchema(),
  apartmentCostAlone: buildMoneyValidationSchema(),
  pageData: pageDataSchema,
};

const contextObject = z.object(beratungshilfeFinanzielleAngaben).partial();
export type BeratungshilfeFinanzielleAngaben = z.infer<typeof contextObject>;
