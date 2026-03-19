import type { Config } from "~/services/flow/server/types";
import type { ProzesskostenhilfeAbgabeUserData } from "./userData";
import { isFeatureFlagEnabled } from "~/services/isFeatureFlagEnabled.server";
import { pkhFormularAbgabePages } from "./pages";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { fileUploadRelevant, readyForAbgabe } from "./guards";

const showFileUpload = Boolean(await isFeatureFlagEnabled("showFileUpload"));
const showAutoSummary = Boolean(await isFeatureFlagEnabled("showAutoSummary"));
const steps = xStateTargetsFromPagesConfig(pkhFormularAbgabePages);

const weitereAngabenId = "#weitere-angaben";

export const abgabeXstateConfig = {
  id: "abgabe",
  initial: steps.abgabeUeberpruefung.relative,
  meta: { excludedFromValidation: true },
  states: {
    [steps.abgabeUeberpruefung.relative]: {
      meta: { triggerValidation: true },
      on: { BACK: weitereAngabenId },
      always: [
        {
          guard: ({ context }) =>
            showFileUpload &&
            fileUploadRelevant({ context }) &&
            readyForAbgabe({ context }),
          target: steps.dokumente.relative,
        },
        {
          guard: readyForAbgabe,
          target: showAutoSummary
            ? steps.zusammenfassung.relative
            : steps.ende.relative,
        },
      ],
    },
    [steps.dokumente.relative]: {
      on: {
        BACK: weitereAngabenId,
        SUBMIT: showAutoSummary
          ? steps.zusammenfassung.relative
          : steps.ende.relative,
      },
    },

    ...(showAutoSummary && {
      [steps.zusammenfassung.relative]: {
        on: {
          BACK: [
            {
              guard: ({ context }) =>
                showFileUpload && fileUploadRelevant({ context }),
              target: steps.dokumente.relative,
            },
            weitereAngabenId,
          ],
          SUBMIT: steps.ende.relative,
        },
      },
    }),

    [steps.ende.relative]: {
      on: {
        BACK: showAutoSummary
          ? steps.zusammenfassung.relative
          : [
              {
                guard: ({ context }) =>
                  showFileUpload && fileUploadRelevant({ context }),
                target: steps.dokumente.relative,
              },
              weitereAngabenId,
            ],
      },
    },
  },
} satisfies Config<ProzesskostenhilfeAbgabeUserData>;
