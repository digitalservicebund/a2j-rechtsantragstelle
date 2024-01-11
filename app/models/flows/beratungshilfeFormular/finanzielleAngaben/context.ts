import { z } from "zod";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { staatlicheLeistungen } from "../../beratungshilfe/context";
import {
  YesNoAnswer,
  customRequiredErrorMessage,
} from "~/services/validation/YesNoAnswer";
import { checkedOptional } from "~/services/validation/checkedCheckbox";

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
};

const contextObject = z.object(beratungshilfeFinanzielleAngaben).partial();
export type BeratungshilfeFinanzielleAngaben = z.infer<typeof contextObject>;

const besitzAngabeDone = (context: BeratungshilfeFinanzielleAngaben) => true;
const berufAngabeDone = (context: BeratungshilfeFinanzielleAngaben) =>
  context.erwerbstaetig !== undefined && context.einkommen !== undefined;

export const beratungshilfeFinanzielleAngabeDone = (
  context: BeratungshilfeFinanzielleAngaben,
) =>
  context.staatlicheLeistungen === "grundsicherung" ||
  context.staatlicheLeistungen === "asylbewerberleistungen" ||
  (context.staatlicheLeistungen === "buergergeld" &&
    besitzAngabeDone(context)) ||
  ((context.staatlicheLeistungen === "andereLeistung" ||
    context.staatlicheLeistungen === "keine") &&
    berufAngabeDone(context) &&
    besitzAngabeDone(context));
