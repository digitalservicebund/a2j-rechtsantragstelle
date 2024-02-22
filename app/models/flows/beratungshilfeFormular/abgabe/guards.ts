import { type BeratungshilfeFormularContext } from "..";
import { anwaltlicheVertretungDone } from "../anwaltlicheVertretung/context";
import { beratungshilfeFinanzielleAngabeDone } from "../finanzielleAngaben/context";
import { grundvoraussetzungDone } from "../grundvoraussetzung/context";
import { beratungshilfePersoenlicheDatenDone } from "../persoenlicheDaten/context";
import { rechtsproblemDone } from "../rechtsproblem/context";

export const beratungshilfeAbgabeGuards = {
  readyForAbgabe: (context: BeratungshilfeFormularContext) =>
    grundvoraussetzungDone(context) &&
    anwaltlicheVertretungDone(context) &&
    rechtsproblemDone(context) &&
    beratungshilfeFinanzielleAngabeDone(context) &&
    beratungshilfePersoenlicheDatenDone(context),
  abgabeOnline: (context: BeratungshilfeFormularContext) =>
    context.abgabeArt == "online",
  abgabeAusdrucken: (context: BeratungshilfeFormularContext) =>
    context.abgabeArt == "ausdrucken",
};
