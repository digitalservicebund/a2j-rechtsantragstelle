import { type BeratungshilfeFormularContext } from "..";
import type { Guards } from "../../guards.server";
import { anwaltlicheVertretungDone } from "../anwaltlicheVertretung/context";
import { beratungshilfeFinanzielleAngabeDone } from "../finanzielleAngaben/context";
import { grundvoraussetzungDone } from "../grundvoraussetzung/context";
import { beratungshilfePersoenlicheDatenDone } from "../persoenlicheDaten/context";
import { rechtsproblemDone } from "../rechtsproblem/context";

export const beratungshilfeAbgabeGuards = {
  readyForAbgabe: ({ context }) =>
    grundvoraussetzungDone(context) &&
    anwaltlicheVertretungDone(context) &&
    rechtsproblemDone(context) &&
    beratungshilfeFinanzielleAngabeDone(context) &&
    beratungshilfePersoenlicheDatenDone(context),
  abgabeOnline: ({ context }) => context.abgabeArt == "online",
  abgabeAusdrucken: ({ context }) => context.abgabeArt == "ausdrucken",
} satisfies Guards<BeratungshilfeFormularContext>;
