import type { Flow } from "~/domains/flows.server";
import { setPartyType } from "~/domains/geldEinklagen/anwaltschaft/services/setPartyType";
import {
  getKlagendeStrings,
  getOrganisationStrings,
} from "~/domains/geldEinklagen/anwaltschaft/stringReplacements";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { getArrayIndexStrings } from "~/domains/shared/formular/stringReplacements";
import { geldEinklagenAnwaltschaftFlowConfig } from "./flowConfig";

export const geldEinklagenAnwaltschaft = {
  flowType: "formFlow",
  stringReplacements: (context: GeldEinklagenAnwaltschaftUserData) => ({
    ...getArrayIndexStrings(context),
    ...getKlagendeStrings(context),
    ...getOrganisationStrings(context),
  }),
  asyncFlowActions: {
    "/klagende-partei/klagenden/#/natuerliche-person-daten": setPartyType(
      "klagende",
      "natuerliche-person",
    ),
    "/klagende-partei/klagenden/#/organisation-daten": setPartyType(
      "klagende",
      "organisation",
    ),
  },
  config: geldEinklagenAnwaltschaftFlowConfig,
} satisfies Flow<typeof geldEinklagenAnwaltschaftFlowConfig.pages>;
