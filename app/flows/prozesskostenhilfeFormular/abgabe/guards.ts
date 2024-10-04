import type { ProzesskostenhilfeFormularContext } from "..";
import type { Guards } from "../../guards.server";
import { prozesskostenhilfeFinanzielleAngabeDone } from "../finanzielleAngaben/doneFunctions";
import { prozesskostenhilfePersoenlicheDatenDone } from "../persoenlicheDaten/doneFunctions";
import { rechtsschutzversicherungDone } from "../rechtsschutzversicherung/doneFunctions";

export const prozesskostenhilfeAbgabeGuards = {
  readyForAbgabe: ({ context }) =>
    rechtsschutzversicherungDone({ context }) &&
    prozesskostenhilfeFinanzielleAngabeDone({ context }) &&
    prozesskostenhilfePersoenlicheDatenDone({ context }),
  abgabeOnline: ({ context }) => context.abgabeArt == "online",
  abgabeAusdrucken: ({ context }) => context.abgabeArt == "ausdrucken",
} satisfies Guards<ProzesskostenhilfeFormularContext>;
