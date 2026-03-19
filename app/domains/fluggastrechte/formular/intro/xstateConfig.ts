import { fluggastrechteFormularPages } from "~/domains/fluggastrechte/formular/pages";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { isFeatureFlagEnabled } from "~/services/isFeatureFlagEnabled.server";

const steps = xStateTargetsFromPagesConfig(fluggastrechteFormularPages);

const showFGROnlineVerfahren = Boolean(
  await isFeatureFlagEnabled("showFGROnlineVerfahren"),
);

export const introXstateConfig = {
  id: "intro",
  initial: steps.intro.relative,
  states: {
    [steps.intro.relative]: {
      on: {
        SUBMIT: [
          {
            target: steps.grundvoraussetzungenStreitbeilegung.absolute,
            guards: () => showFGROnlineVerfahren,
          },
          steps.grundvoraussetzungenDatenverarbeitung.absolute,
        ],
        BACK: steps.redirectVorabcheckErgebnis.relative,
      },
    },
    [steps.redirectVorabcheckErgebnis.relative]: { on: {} },
  },
};
