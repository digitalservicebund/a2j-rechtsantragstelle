import type { Flow } from "~/domains/flows.server";
import { setParteiType } from "~/domains/geldEinklagen/anwaltschaft/services/setParteiType";
import { getKlagendeStrings } from "~/domains/geldEinklagen/anwaltschaft/stringReplacements";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { getArrayIndexStrings } from "~/domains/shared/formular/stringReplacements";
import { geldEinklagenAnwaltschaftFlowConfig } from "./flowConfig";

export const geldEinklagenAnwaltschaft = {
  flowType: "formFlow",
  stringReplacements: (context: GeldEinklagenAnwaltschaftUserData) => ({
    ...getArrayIndexStrings(context),
    ...getKlagendeStrings(context),
  }),
  asyncFlowActions: {
    "/klagende-partei/klagenden/#/natuerliche-person-daten": setParteiType(
      "klagende",
      "natuerliche-person",
    ),
  },
  newEngineConfig: geldEinklagenAnwaltschaftFlowConfig,
} satisfies Flow<typeof geldEinklagenAnwaltschaftFlowConfig.pages>;
