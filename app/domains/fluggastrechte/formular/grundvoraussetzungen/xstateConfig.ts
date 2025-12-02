import type { FluggastrechteGrundvoraussetzungenUserData } from "~/domains/fluggastrechte/formular/grundvoraussetzungen/userData";
import type { Config } from "~/services/flow/server/types";
import { grundvoraussetzungenDone } from "./doneFunctions";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { fluggastrechteGrundvoraussetzungenPages } from "~/domains/fluggastrechte/formular/grundvoraussetzungen/pages";

const steps = xStateTargetsFromPagesConfig(
  fluggastrechteGrundvoraussetzungenPages,
);

export const grundvoraussetzungenXstateConfig = {
  meta: { done: grundvoraussetzungenDone },
  id: "grundvoraussetzungen",
  initial: steps.grundvoraussetzungenDatenverarbeitung.relative,
  states: {
    [steps.grundvoraussetzungenDatenverarbeitung.relative]: {
      on: {
        SUBMIT: steps.grundvoraussetzungenStreitbeilegung.relative,
        BACK: "#intro.start",
      },
    },
    [steps.grundvoraussetzungenStreitbeilegung.relative]: {
      on: {
        SUBMIT: [
          {
            target: steps.grundvoraussetzungenStreitbeilegungGruende.relative,
            guard: "hasNoStreitbeilegung",
          },
          "prozessfaehig",
        ],
        BACK: steps.grundvoraussetzungenDatenverarbeitung.relative,
      },
    },
    [steps.grundvoraussetzungenStreitbeilegungGruende.relative]: {
      on: {
        SUBMIT: "prozessfaehig",
        BACK: steps.grundvoraussetzungenStreitbeilegung.relative,
      },
    },
    prozessfaehig: {
      on: {
        SUBMIT: "ausgleichszahlung",
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
        SUBMIT: "daten-uebernahme",
        BACK: "prozessfaehig",
      },
    },
    "daten-uebernahme": {
      on: {
        SUBMIT: "amtsgericht",
        BACK: "ausgleichszahlung",
      },
    },
    amtsgericht: {
      on: {
        SUBMIT: [
          {
            target: "#streitwert-kosten.gerichtskosten",
            guard: "grundvoraussetzungenDone",
          },
        ],
        BACK: "daten-uebernahme",
      },
    },
  },
} satisfies Config<FluggastrechteGrundvoraussetzungenUserData>;
