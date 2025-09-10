import { beratungshilfePersoenlicheDatenDone } from "~/domains/beratungshilfe/formular/persoenlicheDaten/doneFunctions";
import type { BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular/userData";
import type { Guards } from "../../../guards.server";
import { anwaltlicheVertretungDone } from "../anwaltlicheVertretung/guards";
import { grundvoraussetzungDone } from "../grundvoraussetzung/grundvoraussetzungDone";
import { rechtsproblemDone } from "../rechtsproblem/rechtsproblemDone";
import { beratungshilfeFinanzielleAngabeDone } from "../finanzielleAngaben/beratungshilfeFinanzielleAngabeDone";

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
