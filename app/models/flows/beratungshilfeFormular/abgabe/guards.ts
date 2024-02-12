import { type BeratungshilfeAntragContext } from "..";
import { anwaltlicheVertretungDone } from "../anwaltlicheVertretung/context";
import { beratungshilfeFinanzielleAngabeDone } from "../finanzielleAngaben/context";
import { grundvoraussetzungDone } from "../grundvoraussetzung/context";
import { beratungshilfePersoenlicheDatenDone } from "../persoenlicheDaten/context";
import { rechtsproblemDone } from "../rechtsproblem/context";

export const beratungshilfeAbgabeGuards = {
  readyForAbgabe: (context: BeratungshilfeAntragContext) =>
    grundvoraussetzungDone(context) &&
    anwaltlicheVertretungDone(context) &&
    rechtsproblemDone(context) &&
    beratungshilfeFinanzielleAngabeDone(context) &&
    beratungshilfePersoenlicheDatenDone(context),
  abgabeOnline: (context: BeratungshilfeAntragContext) =>
    context.abgabeArt == "online",
  abgabeAusdrucken: (context: BeratungshilfeAntragContext) =>
    context.abgabeArt == "ausdrucken",
};
