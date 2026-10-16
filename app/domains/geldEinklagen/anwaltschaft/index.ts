import type { Flow } from "~/domains/flows.server";
import { updatePartei } from "~/domains/geldEinklagen/anwaltschaft/services/updateKlagendePartei";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { getArrayIndexStrings } from "~/domains/shared/formular/stringReplacements";
import { geldEinklagenAnwaltschaftFlowConfig } from "./flowConfig";

export const geldEinklagenAnwaltschaft = {
  flowType: "formFlow",
  stringReplacements: (context: GeldEinklagenAnwaltschaftUserData) => ({
    ...getArrayIndexStrings(context),
  }),
  asyncFlowActions: {
    "/klagende-partei/klagenden/#/natuerliche-person-daten": updatePartei(
      "klagende",
      "natuerliche-person",
    ),
  },
  newEngineConfig: geldEinklagenAnwaltschaftFlowConfig,
} satisfies Flow<typeof geldEinklagenAnwaltschaftFlowConfig.pages>;
