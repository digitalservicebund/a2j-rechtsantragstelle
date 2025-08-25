import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import type { Config } from "~/services/flow/server/types";
import { isFeatureFlagEnabled } from "~/services/isFeatureFlagEnabled.server";
import { beratungshilfeAbgabeGuards } from "./guards";
import { berHAntragAbgabePages } from "./pages";
import { type BeratungshilfeAbgabeUserData } from "./userData";

const steps = xStateTargetsFromPagesConfig(berHAntragAbgabePages);
const showFileUpload = await isFeatureFlagEnabled("showFileUpload");

export const abgabeXstateConfig = {
  initial: steps.ueberpruefung.relative,
  id: "abgabe",
  meta: { done: () => false },
  states: {
    [steps.ueberpruefung.relative]: {
      on: { BACK: "#weitere-angaben" },
      meta: { expandValidation: true },
      always: {
        guard: beratungshilfeAbgabeGuards.readyForAbgabe,
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
            target: showFileUpload
              ? steps.dokumente.relative
              : steps.online.relative,
            guard: beratungshilfeAbgabeGuards.abgabeOnline,
          },
          {
            target: steps.ausdrucken.relative,
            guard: beratungshilfeAbgabeGuards.abgabeAusdrucken,
          },
        ],
      },
    },

    ...(showFileUpload && {
      [steps.dokumente.relative]: {
        on: { BACK: steps.art.relative, SUBMIT: steps.online.relative },
      },
    }),

    [steps.ausdrucken.relative]: {
      on: { BACK: { target: steps.art.relative } },
    },
    [steps.online.relative]: {
      on: {
        BACK: {
          target: showFileUpload
            ? steps.dokumente.relative
            : steps.art.relative,
        },
      },
    },
  },
} satisfies Config<BeratungshilfeAbgabeUserData>;
