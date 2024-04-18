import { z } from "zod";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { staatlicheLeistungen } from "../../beratungshilfe/context";
import {
  YesNoAnswer,
  customRequiredErrorMessage,
} from "~/services/validation/YesNoAnswer";
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import { inputRequiredSchema } from "~/services/validation/inputRequired";
import { addDays, createDateSchema, today } from "~/services/validation/date";
import { pageDataSchema } from "~/services/flow/pageDataSchema";
import { integerSchema } from "~/services/validation/integer";
import { optionalOrSchema } from "~/services/validation/optionalOrSchema";

const Eigentuemer = z.enum(
  ["myself", "partner", "myselfAndPartner", "myselfAndSomeoneElse"],
  customRequiredErrorMessage,
);

const MINUS_150_YEARS = -150;
const YEAR_DAYS = 365;

const GrundeigentumArt = z.enum(
  [
    "eigentumswohnung",
    "einfamilienhaus",
    "mehrereWohnungen",
    "unbebaut",
    "erbbaurecht",
    "garage",
  ],
  customRequiredErrorMessage,
);

const unterhaltszahlungSchema = z.object({
  firstName: inputRequiredSchema,
  surname: inputRequiredSchema,
  familyRelationship: z.enum(
    [
      "mother",
      "father",
      "grandmother",
      "grandfather",
      "kid",
      "grandchild",
      "ex-spouse-f",
      "ex-spouse-m",
    ],
    customRequiredErrorMessage,
  ),
  birthday: createDateSchema({
    earliest: () => addDays(today(), MINUS_150_YEARS * YEAR_DAYS),
    latest: () => today(),
  }),
  monthlyPayment: buildMoneyValidationSchema(),
});

export type Unterhaltszahlung = z.infer<typeof unterhaltszahlungSchema>;

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
      kontoDescription: z.string().optional(),
    }),
  ),
  hasKraftfahrzeug: YesNoAnswer,
  kraftfahrzeuge: z.array(
    z.object({
      art: inputRequiredSchema,
      marke: inputRequiredSchema,
      eigentuemer: Eigentuemer,
      verkaufswert: optionalOrSchema(buildMoneyValidationSchema()),
      kilometerstand: inputRequiredSchema,
      anschaffungsjahr: z.string(),
      baujahr: inputRequiredSchema,
      bemerkung: inputRequiredSchema,
      hasArbeitsweg: YesNoAnswer,
      wert: z.enum(
        ["under10000", "over10000", "unsure"],
        customRequiredErrorMessage,
      ),
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
  eigentumTotalWorth: z.enum(
    ["less10000", "more10000", "unsure"],
    customRequiredErrorMessage,
  ),
  hasGrundeigentum: YesNoAnswer,
  grundeigentum: z.array(
    z.object({
      isBewohnt: z.enum(["yes", "family", "no"], customRequiredErrorMessage),
      art: GrundeigentumArt,
      eigentuemer: Eigentuemer,
      flaeche: inputRequiredSchema,
      verkaufswert: buildMoneyValidationSchema(),
      strassehausnummer: inputRequiredSchema,
      plz: z.string().optional(),
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
  hasWeitereUnterhaltszahlungen: YesNoAnswer,
  unterhaltszahlungen: z.array(unterhaltszahlungSchema),
  hasAusgaben: YesNoAnswer,
  ausgabensituation: z.object({
    pregnancy: checkedOptional,
    singleParent: checkedOptional,
    disability: checkedOptional,
    medicalReasons: checkedOptional,
  }),
  ausgaben: z.array(
    z.object({
      art: inputRequiredSchema,
      zahlungsempfaenger: inputRequiredSchema,
      beitrag: buildMoneyValidationSchema(),
      hasZahlungsfrist: YesNoAnswer,
      zahlungsfrist: createDateSchema({
        earliest: () => today(),
      }),
    }),
  ),
  pageData: pageDataSchema,
};

const contextObject = z.object(beratungshilfeFinanzielleAngaben).partial();
export type BeratungshilfeFinanzielleAngaben = z.infer<typeof contextObject>;
