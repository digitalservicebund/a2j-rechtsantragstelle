import type { BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular/userData";
import type { Guards } from "../../../guards.server";

export const beratungshilfeAbgabeGuards = {
  abgabeOnline: ({ context }) => context.abgabeArt == "online",
  abgabeAusdrucken: ({ context }) => context.abgabeArt == "ausdrucken",
} satisfies Guards<BeratungshilfeFormularUserData>;
