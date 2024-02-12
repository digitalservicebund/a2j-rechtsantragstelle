import { z } from "zod";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { staatlicheLeistungen } from "../../beratungshilfe/context";
import {
  YesNoAnswer,
  customRequiredErrorMessage,
} from "~/services/validation/YesNoAnswer";
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import { inputRequiredSchema } from "~/services/validation/inputRequired";

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
  partnerschaft: YesNoAnswer,
  zusammenleben: YesNoAnswer,
  unterhalt: YesNoAnswer,
  unterhaltsSumme: buildMoneyValidationSchema(),
  partnerEinkommen: YesNoAnswer,
  partnerEinkommenSumme: buildMoneyValidationSchema(),
  partnerVorname: inputRequiredSchema,
  partnerNachname: inputRequiredSchema,
  hasBankkonto: YesNoAnswer,
  bankkonten: z.array(
    z.object({
      bankName: inputRequiredSchema,
      kontostand: buildMoneyValidationSchema(),
      iban: inputRequiredSchema,
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
      anschaffungsjahr: inputRequiredSchema,
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
      plz: inputRequiredSchema,
      ort: inputRequiredSchema,
      land: inputRequiredSchema,
    }),
  ),
  hasAdditionalGrundeigentum: YesNoAnswer,
  hasWertsache: YesNoAnswer,
  wertsachen: z.array(
    z.object({
      art: z.enum(
        [
          "cash",
          "valuableItem",
          "digitalMoney",
          "securities",
          "claim",
          "equalizationOfGains",
          "other",
        ],
        customRequiredErrorMessage,
      ),
      eigentuemer: Eigentuemer,
      wert: buildMoneyValidationSchema(),
    }),
  ),
  hasAdditionalWertsache: YesNoAnswer,
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
    case "besitz":
      if (besitzReachable(context)) return "Open";
  }

  return "Hidden";
};

const hasStaatlicheLeistungen = (context: BeratungshilfeFinanzielleAngaben) =>
  context.staatlicheLeistungen == "asylbewerberleistungen" ||
  context.staatlicheLeistungen == "buergergeld" ||
  context.staatlicheLeistungen == "grundsicherung";

const partnerDone = (context: BeratungshilfeFinanzielleAngaben) =>
  (context.staatlicheLeistungen != undefined &&
    hasStaatlicheLeistungen(context)) ||
  context.partnerschaft == "no" ||
  context.unterhalt == "no" ||
  context.partnerEinkommen == "no" ||
  context.partnerEinkommenSumme != undefined ||
  (context.partnerNachname != undefined && context.partnerVorname != undefined);

const partnerReachable = (context: BeratungshilfeFinanzielleAngaben) =>
  !hasStaatlicheLeistungen(context);

const einkommenDone = (context: BeratungshilfeFinanzielleAngaben) =>
  (context.staatlicheLeistungen != undefined &&
    hasStaatlicheLeistungen(context)) ||
  context.einkommen != undefined;

const besitzReachable = (context: BeratungshilfeFinanzielleAngaben) =>
  context.staatlicheLeistungen &&
  (context.staatlicheLeistungen === "buergergeld" ||
    context.staatlicheLeistungen === "andereLeistung" ||
    context.staatlicheLeistungen === "keine");
