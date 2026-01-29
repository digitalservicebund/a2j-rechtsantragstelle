import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import type { Config } from "~/services/flow/server/types";
import { isFeatureFlagEnabled } from "~/services/isFeatureFlagEnabled.server";
import { berHAntragAbgabePages } from "./pages";
import { type BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular/userData";

const steps = xStateTargetsFromPagesConfig(berHAntragAbgabePages);
const showFileUpload = await isFeatureFlagEnabled("showFileUpload");
const showAutoSummary = await isFeatureFlagEnabled("showAutoSummary");

const getOnlineBackTarget = () => {
  if (showFileUpload) {
    return steps.dokumente.relative;
  }
  return steps.art.relative;
};

export const abgabeXstateConfig = {
  initial: steps.ueberpruefung.relative,
  id: "abgabe",
  meta: { excludedFromValidation: true },
  states: {
    [steps.ueberpruefung.relative]: {
      on: {
        BACK: "#weitere-angaben",
      },
      meta: { triggerValidation: true },
      always: {
        guard: ({ context }): boolean =>
          !!context.pageData?.subflowDoneStates &&
          Object.values(context.pageData.subflowDoneStates).every(Boolean),
        target: showAutoSummary
          ? steps.zusammenfassung.relative
          : steps.art.relative,
      },
    },

    ...(showAutoSummary && {
      [steps.zusammenfassung.relative]: {
        on: {
          BACK: "#weitere-angaben",
          SUBMIT: steps.art.relative,
        },
      },
    }),

    [steps.art.relative]: {
      on: {
        BACK: showAutoSummary
          ? steps.zusammenfassung.relative
          : "#weitere-angaben",
        SUBMIT: [
          {
            target: showFileUpload
              ? steps.dokumente.relative
              : steps.online.relative,
            guard: ({ context }) => context.abgabeArt == "online",
          },
          {
            target: steps.ausdrucken.relative,
            guard: ({ context }) => context.abgabeArt == "ausdrucken",
          },
        ],
      },
    },

    ...(showFileUpload && {
      [steps.dokumente.relative]: {
        on: {
          BACK: steps.art.relative,
          SUBMIT: steps.online.relative,
        },
      },
    }),

    [steps.ausdrucken.relative]: {
      on: {
        BACK: {
          target: steps.art.relative,
        },
      },
    },
    [steps.online.relative]: {
      on: {
        BACK: {
          target: getOnlineBackTarget(),
        },
      },
    },
  },
} satisfies Config<BeratungshilfeFormularUserData>;
