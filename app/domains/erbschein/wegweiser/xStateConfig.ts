import { erbscheinWegweiserPages } from "~/domains/erbschein/wegweiser/pages";
import mapValues from "lodash/mapValues";
import { type Config } from "~/services/flow/server/types";
import { type ErbscheinWegweiserUserData } from "~/domains/erbschein/wegweiser/userData";

const stepIds = mapValues(erbscheinWegweiserPages, (v) => v.stepId);

export const erbscheinWegweiserXstateConfig = {
  id: "/erbschein/wegweiser",
  initial: stepIds.start,
  states: {
    [stepIds.start]: {
      on: { SUBMIT: stepIds.verstorbeneName },
    },
    [stepIds.verstorbeneName]: {
      id: stepIds.verstorbeneName,
      on: {
        BACK: stepIds.start,
        SUBMIT: "kinder-recursion",
      },
    },
    "kinder-recursion": {
      id: "kinder-recursion",
      initial: "anzahl-kinder",
      states: {
        // "kinder-router": {
        //   always: [
        //     {
        //       guard: ({ context }) => {
        //         // TODO: calculate which pointer we're at, dive into the context there, and check for >=1 dead child
        //         const firstRecursion = context.kinder?.count === undefined;
        //         return Boolean(
        //           firstRecursion ||
        //           context.kinder?.entries?.some((c) => c.alive === "no"),
        //         );
        //       },
        //       target: "anzahl-kinder", // TODO: dynamically go deeper into 1st dead child,
        //     },
        //     // All children alive, go to next section
        //     `#${stepIds.staatsangehoerigkeit}`,
        //   ],
        // },
        "anzahl-kinder": {
          id: "anzahl-kinder",
          on: {
            BACK: `#${stepIds.verstorbeneName}`, // TODO: figure out back logic
            SUBMIT: [
              {
                guard: ({ context }) => context.kinder?.count === 0,
                target: `#${stepIds.staatsangehoerigkeit}`, // TODO: Go into dead sibling if existing
              },
              "kinder",
            ],
          },
        },
        kinder: {
          id: "kinder",
          on: {
            BACK: "anzahl-kinder",
            SUBMIT: [
              {
                guard: ({ context }) =>
                  Boolean(
                    context.kinder?.entries?.some((c) => c.alive === "no"),
                  ),
                target: "", // TODO: Go deeper into first dead child
              },
              /**
               * All children alive, end of leaf.
               *
               * TODO: Traverse back up the tree to a sibling
               */
              `#${stepIds.staatsangehoerigkeit}`,
            ],
          },
        },
      },
    },
    [stepIds.staatsangehoerigkeit]: {
      id: stepIds.staatsangehoerigkeit,
      on: {
        SUBMIT: [
          {
            guard: ({ context }) => context.staatsangehoerigkeit !== "german",
            target: stepIds.auslaendischerErbfall,
          },
          stepIds.lebensmittelpunkt,
        ],
        BACK: "#kinder-recursion",
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
  },
} satisfies Config<ErbscheinWegweiserUserData>;
