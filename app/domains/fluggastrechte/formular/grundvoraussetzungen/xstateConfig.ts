import type { FluggastrechteGrundvoraussetzungenUserData } from "~/domains/fluggastrechte/formular/grundvoraussetzungen/userData";
import type { Config } from "~/services/flow/server/types";
import { grundvoraussetzungenDone } from "./doneFunctions";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { fluggastrechteFormularPages } from "~/domains/fluggastrechte/formular/pages";

const steps = xStateTargetsFromPagesConfig(fluggastrechteFormularPages);

export const grundvoraussetzungenXstateConfig = {
  meta: { done: grundvoraussetzungenDone },
  id: "grundvoraussetzungen",
  initial: steps.grundvoraussetzungenDatenverarbeitung.relative,
  states: {
    [steps.grundvoraussetzungenDatenverarbeitung.relative]: {
      on: {
        SUBMIT: steps.grundvoraussetzungenStreitbeilegung.relative,
        BACK: steps.intro.absolute,
      },
    },
    [steps.grundvoraussetzungenStreitbeilegung.relative]: {
      on: {
        SUBMIT: [
          {
            target: steps.grundvoraussetzungenStreitbeilegungGruende.relative,
            guard: "hasNoStreitbeilegung",
          },
          steps.grundvorraussetzungenProzessfaehig.relative,
        ],
        BACK: steps.grundvoraussetzungenDatenverarbeitung.relative,
      },
    },
    [steps.grundvoraussetzungenStreitbeilegungGruende.relative]: {
      on: {
        SUBMIT: steps.grundvorraussetzungenProzessfaehig.relative,
        BACK: steps.grundvoraussetzungenStreitbeilegung.relative,
      },
    },
    [steps.grundvorraussetzungenProzessfaehig.relative]: {
      on: {
        SUBMIT: steps.grundvoraussetzungenAusgleichszahlung.relative,
        BACK: [
          {
            target: steps.grundvoraussetzungenStreitbeilegungGruende.relative,
            guard: "hasNoStreitbeilegung",
          },
          steps.grundvoraussetzungenStreitbeilegung.relative,
        ],
      },
    },
    ausgleichszahlung: {
      on: {
        SUBMIT: steps.grundvoraussetzungenDatenUebernahme.relative,
        BACK: steps.grundvorraussetzungenProzessfaehig.relative,
      },
    },
    [steps.grundvoraussetzungenDatenUebernahme.relative]: {
      on: {
        SUBMIT: steps.grundvoraussetzungenAmtsgericht.relative,
        BACK: steps.grundvoraussetzungenAusgleichszahlung.relative,
      },
    },
    [steps.grundvoraussetzungenAmtsgericht.relative]: {
      on: {
        SUBMIT: [
          {
            target: steps.streitwertKostenGerichtskosten.absolute,
            guard: "grundvoraussetzungenDone",
          },
        ],
        BACK: steps.grundvoraussetzungenDatenUebernahme.relative,
      },
    },
  },
} satisfies Config<FluggastrechteGrundvoraussetzungenUserData>;
