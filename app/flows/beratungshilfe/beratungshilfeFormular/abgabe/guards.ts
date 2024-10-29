import type { BeratungshilfeFormularContext } from "~/flows/beratungshilfe/beratungshilfeFormular";
import { beratungshilfePersoenlicheDatenDone } from "~/flows/beratungshilfe/beratungshilfeFormular/persoenlicheDaten/doneFunctions";
import type { Guards } from "../../../guards.server";
import { anwaltlicheVertretungDone } from "../anwaltlicheVertretung/guards";
import { beratungshilfeFinanzielleAngabeDone } from "../finanzielleAngaben/beratungshilfeFinanzielleAngabeDone";
import { grundvoraussetzungDone } from "../grundvoraussetzung/context";
import { rechtsproblemDone } from "../rechtsproblem/context";

export const beratungshilfeAbgabeGuards = {
  readyForAbgabe: ({ context }) =>
    grundvoraussetzungDone({ context }) &&
    anwaltlicheVertretungDone({ context }) &&
    rechtsproblemDone({ context }) &&
    beratungshilfeFinanzielleAngabeDone({ context }) &&
    beratungshilfePersoenlicheDatenDone({ context }),
  abgabeOnline: ({ context }) => context.abgabeArt == "online",
  abgabeAusdrucken: ({ context }) => context.abgabeArt == "ausdrucken",
} satisfies Guards<BeratungshilfeFormularContext>;
