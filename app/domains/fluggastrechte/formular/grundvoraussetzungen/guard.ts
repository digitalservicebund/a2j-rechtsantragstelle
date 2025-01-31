import { Guards, yesNoGuards } from "~/domains/guards.server";
import { FluggastrechteGrundvoraussetzungenContext } from "./context";

export const fluggastrechteGrundvoraussetzungenGuards = {
  ...yesNoGuards("streitbeilegung"),
} satisfies Guards<FluggastrechteGrundvoraussetzungenContext>;
