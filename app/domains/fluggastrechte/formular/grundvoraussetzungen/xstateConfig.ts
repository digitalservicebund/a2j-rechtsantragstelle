import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import type { Config } from "~/services/flow/server/types";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { fluggastrechteFormularPages } from "~/domains/fluggastrechte/formular/pages";

const steps = xStateTargetsFromPagesConfig(fluggastrechteFormularPages);

export const grundvoraussetzungenXstateConfig = {
  id: "grundvoraussetzungen",
  initial: steps.grundvoraussetzungenStreitbeilegung.relative,
  states: {
    [steps.grundvoraussetzungenStreitbeilegung.relative]: {
      on: {
        SUBMIT: [
          {
            target: steps.grundvoraussetzungenStreitbeilegungGruende.relative,
            guard: ({ context }) => context.streitbeilegung === "no",
          },
          steps.grundvorraussetzungenProzessfaehig.relative,
        ],
        BACK: steps.intro.absolute,
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
            guard: ({ context }) => context.streitbeilegung === "no",
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
            guard: ({ context }) =>
              context.pageData?.subflowDoneStates?.["/grundvoraussetzungen"] ===
              true,
          },
        ],
        BACK: steps.grundvoraussetzungenDatenUebernahme.relative,
      },
    },
  },
} satisfies Config<FluggastrechteUserData>;
