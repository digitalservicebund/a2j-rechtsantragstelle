import { type Guards } from "~/domains/guards.server";
import { type FluggastrechteGrundvoraussetzungenContext } from "./context";

export const fluggastrechteGrundvoraussetzungenGuards = {
  hasNoStreitbeilegung: ({ context }) => context.streitbeilegung === "no",
} satisfies Guards<FluggastrechteGrundvoraussetzungenContext>;
