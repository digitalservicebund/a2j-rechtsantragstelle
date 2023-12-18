import { z } from "zod";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { staatlicheLeistungen } from "../../beratungshilfe/pages";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const beratungshilfeFinanzielleAngaben = {
  einkommen: buildMoneyValidationSchema(),
  erwaerbstaetig: YesNoAnswer,
  staatlicheLeistungen,
};

const contextObject = z.object(beratungshilfeFinanzielleAngaben).partial();
export type BeratungshilfeFinanzielleAngaben = z.infer<typeof contextObject>;

const besitzAngabeDone = (context: BeratungshilfeFinanzielleAngaben) => true;
const berufAngabeDone = (context: BeratungshilfeFinanzielleAngaben) =>
  context.erwaerbstaetig !== undefined && context.einkommen !== undefined;

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
