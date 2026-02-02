import type { Config } from "~/services/flow/server/types";
import type { ProzesskostenhilfeAbgabeUserData } from "./userData";
import { isFeatureFlagEnabled } from "~/services/isFeatureFlagEnabled.server";
import { pkhFormularAbgabePages } from "./pages";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";

const showFileUpload = await isFeatureFlagEnabled("showFileUpload");
const steps = xStateTargetsFromPagesConfig(pkhFormularAbgabePages);

export const abgabeXstateConfig = {
  id: "abgabe",
  initial: steps.abgabeUeberpruefung.relative,
  meta: { excludedFromValidation: true },
  states: {
    [steps.abgabeUeberpruefung.relative]: {
      meta: { triggerValidation: true },
      on: {
        BACK: steps.weitereAngaben.absolute,
      },
      always: [
        {
          guard: ({ context }) =>
            readyForAbgabe({ context }) &&
            fileUploadRelevant({ context }) &&
            Boolean(showFileUpload),
          target: steps.dokumente.relative,
        },
        {
          guard: ({ context }) =>
            !!context.pageData?.subflowDoneStates &&
            Object.values(context.pageData.subflowDoneStates).every(Boolean),
          target: steps.ende.relative,
        },
      ],
    },
    [steps.dokumente.relative]: {
      on: {
        BACK: steps.weitereAngaben.absolute,
        SUBMIT: steps.ende.relative,
      },
    },
    [steps.ende.relative]: {
      on: {
        BACK: [
          {
            guard: ({ context }) =>
              Boolean(showFileUpload) && fileUploadRelevant({ context }),
            target: steps.dokumente.relative,
          },
          steps.weitereAngaben.absolute,
        ],
      },
    },
  },
} satisfies Config<ProzesskostenhilfeAbgabeUserData>;
