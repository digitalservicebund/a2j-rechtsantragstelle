import { z } from "zod";
import { staatlicheLeistungen } from "~/flows/beratungshilfeVorabcheck/context";
import { pageDataSchema } from "~/services/flow/pageDataSchema";
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import { addYears, createDateSchema, today } from "~/services/validation/date";
import { integerSchema } from "~/services/validation/integer";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { optionalOrSchema } from "~/services/validation/optionalOrSchema";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { createYearSchema } from "~/services/validation/year";
import {
  YesNoAnswer,
  customRequiredErrorMessage,
} from "~/services/validation/YesNoAnswer";
import { BeratungshilfeFormularContext } from "..";

const Eigentuemer = z.enum(
  ["myself", "partner", "myselfAndPartner", "myselfAndSomeoneElse"],
  customRequiredErrorMessage,
);

const MINUS_150_YEARS = -150;

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

export function pruneContext(
  context: BeratungshilfeFormularContext,
): Partial<BeratungshilfeFormularContext> {
  const prunedContext: BeratungshilfeFormularContext = {};
  // guard for asyl? (frede found bug!)

  // einkommen
  prunedContext.einkommen = context.einkommen;

  // partnerschaft
  prunedContext.partnerschaft = context.partnerschaft;
  if (context.partnerschaft === "yes") {
    prunedContext.zusammenleben = context.zusammenleben;
    if (context.zusammenleben === "yes") {
      prunedContext.partnerEinkommen = context.partnerEinkommen;
      if (context.partnerEinkommen === "yes") {
        prunedContext.partnerEinkommenSumme = context.partnerEinkommenSumme;
      }
    }
  }

  // bankkonto
  prunedContext.hasBankkonto = context.hasBankkonto;
  if (context.hasBankkonto === "yes") {
    prunedContext.bankkonten = context.bankkonten;
  }

  // geldanlagen
  prunedContext.hasGeldanlage = context.hasGeldanlage;
  if (context.hasGeldanlage === "yes") {
    prunedContext.geldanlagen = [];
    context.geldanlagen?.forEach((geldanlage) => {
      switch (geldanlage.art) {
        case "wertpapiere":
        case "guthabenkontoKrypto":
        case "bargeld": {
          prunedContext.geldanlagen!.push({
            art: geldanlage.art,
            eigentuemer: geldanlage.eigentuemer,
            wert: geldanlage.wert,
          });
          break;
        }
        case "giroTagesgeldSparkonto": {
          prunedContext.geldanlagen!.push({
            art: geldanlage.art,
            eigentuemer: geldanlage.eigentuemer,
            wert: geldanlage.wert,
            kontoBankName: geldanlage.kontoBankName,
            kontoIban: geldanlage.kontoIban,
            kontoBezeichnung: geldanlage.kontoBezeichnung,
          });
          break;
        }
        case "befristet": {
          prunedContext.geldanlagen!.push({
            art: geldanlage.art,
            eigentuemer: geldanlage.eigentuemer,
            befristetArt: geldanlage.befristetArt,
            verwendungszweck: geldanlage.verwendungszweck,
            wert: geldanlage.wert,
            auszahlungdatum: geldanlage.auszahlungdatum,
            kontoBankName: geldanlage.kontoBankName,
            kontoIban: geldanlage.kontoIban,
            kontoBezeichnung: geldanlage.kontoBezeichnung,
          });
          break;
        }
        case "forderung": {
          prunedContext.geldanlagen!.push({
            art: geldanlage.art,
            forderung: geldanlage.forderung,
            eigentuemer: geldanlage.eigentuemer,
            wert: geldanlage.wert,
          });
          break;
        }
        case "sonstiges": {
          prunedContext.geldanlagen!.push({
            art: geldanlage.art,
            eigentuemer: geldanlage.eigentuemer,
            verwendungszweck: geldanlage.verwendungszweck,
            wert: geldanlage.wert,
          });
          break;
        }
      }
    });
  }

  return prunedContext;
}

const unterhaltszahlungSchema = z.object({
  firstName: stringRequiredSchema,
  surname: stringRequiredSchema,
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
    earliest: () => addYears(today(), MINUS_150_YEARS),
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
  partnerVorname: stringRequiredSchema,
  partnerNachname: stringRequiredSchema,
  hasKinder: YesNoAnswer,
  kinder: z.array(
    z.object({
      vorname: stringRequiredSchema,
      nachname: stringRequiredSchema,
      geburtsdatum: createDateSchema({
        earliest: () => addYears(today(), -24),
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
      bankName: stringRequiredSchema,
      kontostand: buildMoneyValidationSchema({}),
      iban: stringOptionalSchema,
      kontoEigentuemer: Eigentuemer,
      kontoDescription: stringOptionalSchema,
    }),
  ),
  hasKraftfahrzeug: YesNoAnswer,
  kraftfahrzeuge: z.array(
    z.object({
      art: stringRequiredSchema,
      marke: stringRequiredSchema,
      eigentuemer: Eigentuemer,
      verkaufswert: optionalOrSchema(buildMoneyValidationSchema()),
      kilometerstand: integerSchema,
      anschaffungsjahr: createYearSchema({
        optional: true,
        latest: () => today().getFullYear(),
      }),
      baujahr: createYearSchema({ latest: () => today().getFullYear() }),
      bemerkung: stringRequiredSchema,
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

      kontoBankName: stringOptionalSchema,
      kontoIban: stringOptionalSchema,
      kontoBezeichnung: stringOptionalSchema,

      befristetArt: z
        .enum(
          ["lifeInsurance", "buildingSavingsContract", "fixedDepositAccount"],
          customRequiredErrorMessage,
        )
        .optional(),

      forderung: stringOptionalSchema,
      verwendungszweck: stringOptionalSchema,
      auszahlungdatum: stringOptionalSchema,
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
      flaeche: stringRequiredSchema,
      verkaufswert: buildMoneyValidationSchema(),
      strassehausnummer: stringRequiredSchema,
      plz: stringOptionalSchema,
      ort: stringRequiredSchema,
      land: stringRequiredSchema,
    }),
  ),
  hasWertsache: YesNoAnswer,
  wertsachen: z.array(
    z.object({
      art: stringRequiredSchema,
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
      art: stringRequiredSchema,
      zahlungsempfaenger: stringRequiredSchema,
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
