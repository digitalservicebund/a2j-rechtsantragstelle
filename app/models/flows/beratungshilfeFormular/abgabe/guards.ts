import { type BeratungshilfeAntragContext } from "..";
import { beratungshilfeFinanzielleAngabeDone } from "../finanzielleAngaben/context";
import { grundvoraussetzungDone } from "../grundvoraussetzung/context";
import { beratungshilfePersoenlicheDatenDone } from "../persoenlicheDaten/context";
import { rechtsproblemDone } from "../rechtsproblem/context";

export const beratungshilfeAbgabeGuards = {
  readyForAbgabe: (context: BeratungshilfeAntragContext) =>
    grundvoraussetzungDone(context) &&
    rechtsproblemDone(context) &&
    beratungshilfeFinanzielleAngabeDone(context) &&
    beratungshilfePersoenlicheDatenDone(context),
  abgabeOnline: (context: BeratungshilfeAntragContext) =>
    context.abgabeArt == "online",
  abgabeDownload: (context: BeratungshilfeAntragContext) =>
    context.abgabeArt == "download",
};
