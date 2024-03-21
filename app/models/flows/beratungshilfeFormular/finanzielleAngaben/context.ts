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
    wohngeld: checkedOptional,
    kindergeld: checkedOptional,
    bafoeg: checkedOptional,
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
  hasAdditionalBankkonto: YesNoAnswer,
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
  hasAdditionalKraftfahrzeug: YesNoAnswer,
  hasGeldanlage: YesNoAnswer,
  geldanlagen: z.array(
    z.object({
      art: z.enum(
        ["lifeInsurance", "buildingSavingsContract", "fixedDepositAccount"],
        customRequiredErrorMessage,
      ),
      eigentuemer: Eigentuemer,
      verwendungszweck: inputRequiredSchema,
      auszahlungwert: buildMoneyValidationSchema(),
      auszahlungdatum: inputRequiredSchema,
    }),
  ),
  besitzTotalWorth: z.enum(
    ["less10000", "more10000", "unsure"],
    customRequiredErrorMessage,
  ),
  hasAdditionalGeldanlage: YesNoAnswer,
  hasGrundeigentum: YesNoAnswer,
  grundeigentumBewohnt: z.array(
    z.object({
      art: GrundeigentumArt,
      eigentuemer: Eigentuemer,
      flaeche: inputRequiredSchema,
      verkaufswert: buildMoneyValidationSchema(),
    }),
  ),
  grundeigentum: z.array(
    z.object({
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
  hasAdditionalGrundeigentum: YesNoAnswer,
  hasWertsache: YesNoAnswer,
  wertsachen: z.array(
    z.object({
      art: inputRequiredSchema,
      eigentuemer: Eigentuemer,
      wert: buildMoneyValidationSchema(),
    }),
  ),
  hasAdditionalWertsache: YesNoAnswer,
  pageData: pageDataSchema,
};

const contextObject = z.object(beratungshilfeFinanzielleAngaben).partial();
export type BeratungshilfeFinanzielleAngaben = z.infer<typeof contextObject>;

export const beratungshilfeFinanzielleAngabeDone = (
  context: BeratungshilfeFinanzielleAngaben,
) => einkommenDone(context) && partnerDone(context);

export type SubflowState = "Done" | "Open" | "Hidden";

export const beratungshilfeFinanzielleAngabenSubflowState = (
  context: BeratungshilfeFinanzielleAngaben,
  subflowId: string,
): SubflowState => {
  switch (subflowId) {
    case "einkommen":
      if (einkommenDone(context)) return "Done";
      break;
    case "partner":
      if (!partnerReachable(context)) return "Hidden";
      if (partnerDone(context)) return "Done";
      break;
    case "kinder":
      if (!kinderReachable(context)) return "Hidden";
      if (kinderDone(context)) return "Done";
      break;
    case "besitz":
      if (!besitzReachable(context)) return "Hidden";
      if (besitzDone(context)) return "Done";
  }

  return "Open";
};

const hasStaatlicheLeistungen = (context: BeratungshilfeFinanzielleAngaben) =>
  context.staatlicheLeistungen == "asylbewerberleistungen" ||
  context.staatlicheLeistungen == "buergergeld" ||
  context.staatlicheLeistungen == "grundsicherung";

const einkommenDone = (context: BeratungshilfeFinanzielleAngaben) =>
  (context.staatlicheLeistungen != undefined &&
    hasStaatlicheLeistungen(context)) ||
  context.einkommen != undefined;

const partnerReachable = (context: BeratungshilfeFinanzielleAngaben) =>
  !hasStaatlicheLeistungen(context);

const partnerDone = (context: BeratungshilfeFinanzielleAngaben) =>
  (context.staatlicheLeistungen != undefined &&
    hasStaatlicheLeistungen(context)) ||
  ["no", "widowed"].includes(context.partnerschaft ?? "") ||
  context.unterhalt == "no" ||
  context.partnerEinkommen == "no" ||
  context.partnerEinkommenSumme != undefined ||
  (context.partnerNachname != undefined && context.partnerVorname != undefined);

const kinderReachable = (context: BeratungshilfeFinanzielleAngaben) =>
  !hasStaatlicheLeistungen(context);

const kinderDone = (context: BeratungshilfeFinanzielleAngaben) =>
  context.hasKinder == "no" || context.kinder !== undefined;

const besitzReachable = (context: BeratungshilfeFinanzielleAngaben) =>
  context.staatlicheLeistungen &&
  (context.staatlicheLeistungen === "buergergeld" ||
    context.staatlicheLeistungen === "andereLeistung" ||
    context.staatlicheLeistungen === "keine");

const besitzDone = (context: BeratungshilfeFinanzielleAngaben) =>
  context.hasBankkonto !== undefined &&
  context.hasKraftfahrzeug !== undefined &&
  context.hasGeldanlage !== undefined &&
  context.hasGrundeigentum !== undefined &&
  context.hasWertsache !== undefined;
