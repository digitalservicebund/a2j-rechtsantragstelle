import { type Guards } from "~/domains/guards.server";
import { type FluggastrechteGrundvoraussetzungenUserData } from "./userData";

export const fluggastrechteGrundvoraussetzungenGuards = {
  hasNoStreitbeilegung: ({ context }) => context.streitbeilegung === "no",
} satisfies Guards<FluggastrechteGrundvoraussetzungenUserData>;
