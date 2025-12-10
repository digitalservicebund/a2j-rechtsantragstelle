import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { type Config } from "~/services/flow/server/types";
import { type GeldEinklagenFormularGerichtPruefenUserData } from "./userData";
import { geldEinklagenGerichtPruefenPages } from "./pages";
import { forderungDone } from "./doneFunctions";
import { sachgebietXstateConfig } from "./sachgebiet/xstateConfig";
import { klagendePersonXstateConfig } from "./klagendePerson/xStateConfig";
import { beklagtePersonXstateConfig } from "./beklagtePerson/xStateConfig";
import { gerichtSuchenXstateConfig } from "./gericht-suchen/xStateConfig";
import { zustaendigesGerichtXstateConfig } from "./zustaendiges-gericht/xStateConfig";

const steps = xStateTargetsFromPagesConfig(geldEinklagenGerichtPruefenPages);

export const gerichtPruefenXstateConfig = {
  id: "gericht-pruefen",
  initial: "intro",
  states: {
    intro: {
      id: "intro",
      initial: "voraussetzungen",
      states: {
        [steps.introVoraussetzungen.relative]: {
          on: {
            SUBMIT: steps.introStart.relative,
          },
        },
        [steps.introStart.relative]: {
          on: {
            SUBMIT: steps.forderungWas.absolute,
            BACK: steps.introVoraussetzungen.relative,
          },
        },
      },
    },
    forderung: {
      id: "forderung",
      initial: "was",
      states: {
        [steps.forderungWas.relative]: {
          on: {
            SUBMIT: [
              {
                guard: ({ context }) => context.forderung === "etwasAnderes",
                target: "ergebnis/forderung-etwas-anderes",
              },
              { guard: forderungDone, target: steps.sachgebietInfo.absolute },
            ],
            BACK: steps.introStart.absolute,
          },
        },
        "ergebnis/forderung-etwas-anderes": {
          on: {
            BACK: steps.forderungWas.relative,
          },
        },
      },
    },
    sachgebiet: sachgebietXstateConfig,
    "klagende-person": klagendePersonXstateConfig,
    "beklagte-person": beklagtePersonXstateConfig,
    "gericht-suchen": gerichtSuchenXstateConfig,
    "zustaendiges-gericht": zustaendigesGerichtXstateConfig,
  },
} satisfies Config<GeldEinklagenFormularGerichtPruefenUserData>;
