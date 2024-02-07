import { z } from "zod";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { staatlicheLeistungen } from "../../beratungshilfe/context";
import {
  YesNoAnswer,
  customRequiredErrorMessage,
} from "~/services/validation/YesNoAnswer";
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import { inputRequiredSchema } from "~/services/validation/inputRequired";

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
      kontoEigentuemer: z.enum(
        ["myself", "partner"],
        customRequiredErrorMessage,
      ),
    }),
  ),
  hasAdditionalBankkonto: YesNoAnswer,
  hasKraftfahrzeuge: YesNoAnswer,
  kraftfahrzeuge: z.array(
    // TODO: correct types
    z.object({
      typ: inputRequiredSchema,
      marke: inputRequiredSchema,
      eigentuemer: inputRequiredSchema,
      verkaufswert: buildMoneyValidationSchema(),
      kilometerstand: inputRequiredSchema,
      baujahr: inputRequiredSchema,
      bemerkung: inputRequiredSchema,
    }),
  ),
  hasAdditionalKraftfahrzeuge: YesNoAnswer,
};

const contextObject = z.object(beratungshilfeFinanzielleAngaben).partial();
export type BeratungshilfeFinanzielleAngabenContext = z.infer<
  typeof contextObject
>;

export const beratungshilfeFinanzielleAngabeDone = (
  context: BeratungshilfeFinanzielleAngabenContext,
) => einkommenDone(context) && partnerDone(context);

export const beratungshilfeFinanzielleAngabenSubflowState = (
  context: BeratungshilfeFinanzielleAngabenContext,
  subflowId: string,
) => {
  switch (subflowId) {
    case "einkommen":
      if (einkommenDone(context)) return "Done";
      break;
    case "partner":
      if (!partnerReachable(context)) break;
      if (partnerDone(context)) return "Done";
      break;
    case "besitz":
      return "Open";
  }

  return undefined;
};

const hasStaatlicheLeistungen = (
  context: BeratungshilfeFinanzielleAngabenContext,
) =>
  context.staatlicheLeistungen == "asylbewerberleistungen" ||
  context.staatlicheLeistungen == "buergergeld" ||
  context.staatlicheLeistungen == "grundsicherung";

const partnerDone = (context: BeratungshilfeFinanzielleAngabenContext) =>
  (context.staatlicheLeistungen != undefined &&
    hasStaatlicheLeistungen(context)) ||
  context.partnerschaft == "no" ||
  context.unterhalt == "no" ||
  context.partnerEinkommen == "no" ||
  context.partnerEinkommenSumme != undefined ||
  (context.partnerNachname != undefined && context.partnerVorname != undefined);

const partnerReachable = (context: BeratungshilfeFinanzielleAngabenContext) =>
  !hasStaatlicheLeistungen(context);

const einkommenDone = (context: BeratungshilfeFinanzielleAngabenContext) =>
  (context.staatlicheLeistungen != undefined &&
    hasStaatlicheLeistungen(context)) ||
  context.einkommen != undefined;
