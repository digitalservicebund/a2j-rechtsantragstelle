import { beratungshilfeFinanzielleAngabeDone } from "~/flows/beratungshilfeFormular/finanzielleAngaben/navStates";
import { ProzesskostenhilfeFormularContext } from "..";
import type { Guards } from "../../guards.server";

export const prozesskostenhilfeAbgabeGuards = {
  readyForAbgabe: ({ context }) =>
    beratungshilfeFinanzielleAngabeDone({ context }),
  abgabeOnline: ({ context }) => context.abgabeArt == "online",
  abgabeAusdrucken: ({ context }) => context.abgabeArt == "ausdrucken",
} satisfies Guards<ProzesskostenhilfeFormularContext>;
