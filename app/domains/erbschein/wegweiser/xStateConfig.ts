import type { Config } from "~/services/flow/server/types";
import { erbscheinWegweiserPages } from "~/domains/erbschein/wegweiser/pages";
import { type ErbscheinWegweiserUserData } from "~/domains/erbschein/wegweiser/userData";
import mapValues from "lodash/mapValues";

const stepIds = mapValues(erbscheinWegweiserPages, (v) => v.stepId);

// Machine ID used for absolute xState #id references from nested states
const machineId = "/erbschein/wegweiser";

export const erbscheinWegweiserXstateConfig = {
  id: machineId,
  initial: stepIds.start,
  states: {
    [stepIds.start]: {
      on: { SUBMIT: stepIds.staatsangehoerigkeit },
    },
    [stepIds.staatsangehoerigkeit]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.staatsangehoerigkeit !== "german",
            target: stepIds.auslaendischerErbfall,
          },
          stepIds.lebensmittelpunkt,
        ],
        BACK: stepIds.start,
      },
    },
    [stepIds.lebensmittelpunkt]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.lebensmittelpunkt === "ausland",
            target: stepIds.auslaendischerErbfall,
          },
          stepIds.testamentOderErbvertrag,
        ],
        BACK: stepIds.staatsangehoerigkeit,
      },
    },
    [stepIds.auslaendischerErbfall]: {
      on: {
        BACK: [
          {
            guard: ({ context }) => context.staatsangehoerigkeit !== "german",
            target: stepIds.staatsangehoerigkeit,
          },
          stepIds.lebensmittelpunkt,
        ],
      },
    },
    [stepIds.testamentOderErbvertrag]: {
      on: {
        BACK: stepIds.lebensmittelpunkt,
        SUBMIT: [
          {
            guard: ({ context }) => context.testamentType === "notarized",
            target: stepIds.notarizedTestament,
          },
          {
            guard: ({ context }) => context.testamentType === "erbvertrag",
            target: stepIds.erbvertrag,
          },
          stepIds.grundeigentum,
        ],
      },
    },
    [stepIds.notarizedTestament]: {
      on: { BACK: stepIds.testamentOderErbvertrag },
    },
    [stepIds.erbvertrag]: {
      on: { BACK: stepIds.testamentOderErbvertrag },
    },
    [stepIds.grundeigentum]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) =>
              context.hasGrundeigentum === "yes" &&
              context.testamentType === "handwritten",
            target: stepIds.erbscheinRequiredHandwrittenTestament,
          },
          {
            guard: ({ context }) =>
              context.hasGrundeigentum === "yes" &&
              context.testamentType === "none",
            target: stepIds.erbscheinRequiredNoTestament,
          },
          stepIds.unternehmen,
        ],
        BACK: stepIds.testamentOderErbvertrag,
      },
    },
    [stepIds.erbscheinRequiredHandwrittenTestament]: {
      on: {
        BACK: [
          {
            guard: ({ context }) => context.hasGrundeigentum === "yes",
            target: stepIds.grundeigentum,
          },
          stepIds.unternehmen,
        ],
      },
    },
    [stepIds.erbscheinRequiredNoTestament]: {
      on: {
        BACK: [
          {
            guard: ({ context }) => context.hasGrundeigentum === "yes",
            target: stepIds.grundeigentum,
          },
          {
            guard: ({ context }) => context.hasUnternehmen === "yes",
            target: stepIds.unternehmen,
          },
          stepIds.bankRequestedErbschein,
        ],
      },
    },
    [stepIds.unternehmen]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) =>
              context.hasUnternehmen === "yes" &&
              context.testamentType === "handwritten",
            target: stepIds.erbscheinRequiredHandwrittenTestament,
          },
          {
            guard: ({ context }) =>
              context.hasUnternehmen === "yes" &&
              context.testamentType === "none",
            target: stepIds.erbscheinRequiredNoTestament,
          },
          stepIds.bankRequestedErbschein,
        ],
        BACK: stepIds.grundeigentum,
      },
    },
    [stepIds.bankRequestedErbschein]: {
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.bankRequestedErbschein === "no",
            target: stepIds.erbscheinNotRequired,
          },
          stepIds.erbscheinRequiredNoTestament,
        ],
        BACK: stepIds.unternehmen,
      },
    },
    [stepIds.erbscheinNotRequired]: {
      on: {
        BACK: stepIds.bankRequestedErbschein,
      },
    },

    // --- Erbfolge: nested arrays PoC ---
    erbfolge: {
      initial: "kinder",
      states: {
        kinder: {
          id: "erbfolge-kinder",
          initial: "uebersicht",
          states: {
            // Overview page listing all children
            uebersicht: {
              on: {
                BACK: `#${machineId}.${stepIds.bankRequestedErbschein}`,
                "add-kinder": {
                  target: "kind",
                },
              },
            },
            // Array container for individual child entry
            kind: {
              initial: "daten",
              states: {
                // Child data form (level 1 array page)
                daten: {
                  on: {
                    SUBMIT: [
                      {
                        guard: ({
                          context,
                        }: {
                          context: ErbscheinWegweiserUserData;
                        }) => {
                          // If child is deceased, go to enkelkinder
                          const indexes = (context as Record<string, unknown>)
                            .pageData as
                            | { arrayIndexes?: number[] }
                            | undefined;
                          const idx = indexes?.arrayIndexes?.[0] ?? 0;
                          return context.kinder?.[idx]?.istVerstorben === "yes";
                        },
                        target: "#enkelkinder-uebersicht",
                      },
                      "#erbfolge-kinder.uebersicht",
                    ],
                    BACK: "#erbfolge-kinder.uebersicht",
                  },
                },
                // Enkelkinder section (nested within a specific child)
                enkelkinder: {
                  initial: "uebersicht",
                  states: {
                    uebersicht: {
                      id: "enkelkinder-uebersicht",
                      on: {
                        SUBMIT: "#erbfolge-kinder.uebersicht",
                        BACK: "#erbfolge-kinder.kind.daten",
                        "add-enkelkinder": {
                          target: "enkelkind",
                        },
                      },
                    },
                    // Array container for individual grandchild entry
                    enkelkind: {
                      initial: "daten",
                      states: {
                        daten: {
                          on: {
                            SUBMIT: "#enkelkinder-uebersicht",
                            BACK: "#enkelkinder-uebersicht",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
} satisfies Config<ErbscheinWegweiserUserData>;
