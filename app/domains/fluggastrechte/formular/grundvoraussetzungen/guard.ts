import { Guards } from "~/domains/guards.server";
import { FluggastrechteGrundvoraussetzungenContext } from "./context";

export const fluggastrechteGrundvoraussetzungenGuards = {
  hasNoStreitbeilegung: ({ context }) => context.streitbeilegung === "no",
} satisfies Guards<FluggastrechteGrundvoraussetzungenContext>;
