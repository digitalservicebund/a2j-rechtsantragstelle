import type { BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular";
import { beratungshilfePersoenlicheDatenDone } from "~/domains/beratungshilfe/formular/persoenlicheDaten/doneFunctions";
import type { Guards } from "../../../guards.server";
import { anwaltlicheVertretungDone } from "../anwaltlicheVertretung/guards";
import { beratungshilfeFinanzielleAngabeDone } from "../finanzielleAngaben/beratungshilfeFinanzielleAngabeDone";
import { grundvoraussetzungDone } from "../grundvoraussetzung/userData";
import { rechtsproblemDone } from "../rechtsproblem/userData";

export const beratungshilfeAbgabeGuards = {
  readyForAbgabe: ({ context }) =>
    grundvoraussetzungDone({ context }) &&
    anwaltlicheVertretungDone({ context }) &&
    rechtsproblemDone({ context }) &&
    beratungshilfeFinanzielleAngabeDone({ context }) &&
    beratungshilfePersoenlicheDatenDone({ context }),
  abgabeOnline: ({ context }) => context.abgabeArt == "online",
  abgabeAusdrucken: ({ context }) => context.abgabeArt == "ausdrucken",
} satisfies Guards<BeratungshilfeFormularUserData>;
