import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import type { Config } from "~/services/flow/server/types";
import { berHAntragAbgabePages } from "./pages";
import { type BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular/userData";

const steps = xStateTargetsFromPagesConfig(berHAntragAbgabePages);

export const abgabeXstateConfig = {
  initial: steps.ueberpruefung.relative,
  id: steps.abgabe.relative,
  meta: { excludedFromValidation: true },
  states: {
    [steps.ueberpruefung.relative]: {
      on: { BACK: "#weitere-angaben" },
      meta: { triggerValidation: true },
      always: {
        guard: ({ context }): boolean =>
          !!context.pageData?.subflowDoneStates &&
          Object.entries(context.pageData.subflowDoneStates)
            .filter(
              ([stepId]) => !stepId.startsWith(`/${steps.abgabe.relative}`),
            )
            .every(([, subflowDone]) => Boolean(subflowDone)),
        target: steps.zusammenfassung.relative,
      },
    },
    [steps.zusammenfassung.relative]: {
      on: { BACK: "#weitere-angaben", SUBMIT: steps.art.relative },
    },

    [steps.art.relative]: {
      on: {
        BACK: steps.zusammenfassung.relative,
        SUBMIT: [
          {
            target: steps.online.relative,
            guard: ({ context }) => context.abgabeArt == "online",
          },
          {
            target: steps.ausdrucken.relative,
            guard: ({ context }) => context.abgabeArt == "ausdrucken",
          },
        ],
      },
    },
    [steps.ausdrucken.relative]: {
      on: {
        BACK: {
          target: steps.art.relative,
        },
      },
    },
    [steps.online.relative]: {
      on: { BACK: { target: steps.art.relative } },
    },
  },
} satisfies Config<BeratungshilfeFormularUserData>;
