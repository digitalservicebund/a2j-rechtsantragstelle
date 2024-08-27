import type { ProzesskostenhilfeFormularContext } from "..";
import type { Guards } from "../../guards.server";
import { prozesskostenhilfeFinanzielleAngabeDone } from "../finanzielleAngaben/doneFunctions";

export const prozesskostenhilfeAbgabeGuards = {
  readyForAbgabe: ({ context }) =>
    prozesskostenhilfeFinanzielleAngabeDone({ context }),
  abgabeOnline: ({ context }) => context.abgabeArt == "online",
  abgabeAusdrucken: ({ context }) => context.abgabeArt == "ausdrucken",
} satisfies Guards<ProzesskostenhilfeFormularContext>;
