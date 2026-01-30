import {
  erbscheinWegweiserPages,
  type NestedKinder,
} from "~/domains/erbschein/wegweiser/pages";
import mapValues from "lodash/mapValues";
import { type Config } from "~/services/flow/server/types";
import { type ErbscheinWegweiserUserData } from "~/domains/erbschein/wegweiser/userData";
import { assign } from "xstate";

const stepIds = mapValues(erbscheinWegweiserPages, (v) => v.stepId);

const popLastChild = ({ context }: { context: ErbscheinWegweiserUserData }) => {
  const { pageData } = context;
  return {
    nestedArrayHistory: pageData?.nestedArrayHistory?.slice(0, -1),
  };
};

// Try "pointer" (last array item) first; if undefined, we're at the root
const getCurrentNode = ({
  context,
}: {
  context: ErbscheinWegweiserUserData;
}): NestedKinder | undefined =>
  context.pageData?.nestedArrayHistory?.pop() ?? context.kinder;

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
        "kinder-router": {
          always: [
            /**
             * History is empty, end of recursion
             */
            {
              guard: ({ context }) =>
                context.pageData?.nestedArrayHistory !== undefined &&
                context.pageData?.nestedArrayHistory.length === 0,
              target: "#staatsangehoerigkeit",
            },
            /**
             * Children not entered yet
             */
            {
              guard: ({ context }) =>
                getCurrentNode({ context })?.count === undefined,
              target: "anzahl-kinder",
            },
            /**
             * Children have already been defined, pop last item from history and loop
             */
            {
              target: "kinder-router",
              actions: assign({
                pageData: popLastChild,
              }),
              reenter: true,
            },
          ],
        },
        "anzahl-kinder": {
          id: "anzahl-kinder",
          on: {
            BACK: `#${stepIds.verstorbeneName}`, // TODO: figure out back logic
            SUBMIT: [
              /**
               * No children, pop pointer from stack and loop
               */
              {
                guard: ({ context }) => {
                  return getCurrentNode({ context })?.count === 0;
                },
                actions: assign({
                  pageData: popLastChild,
                }),
                target: "kinder-router",
              },
              /**
               * Enter children's details
               */
              {
                // Guard needed to prevent infinite loop during pruning, etc
                guard: ({ context }) =>
                  getCurrentNode({ context })?.count !== undefined,
                target: "kinder",
              },
            ],
          },
        },
        kinder: {
          id: "kinder",
          on: {
            BACK: "anzahl-kinder",
            SUBMIT: [
              /**
               * No dead children, pop pointer from stack and loop
               */
              {
                guard: ({ context }) =>
                  Boolean(
                    getCurrentNode({ context })?.entries?.every(
                      (c) => c.alive === "yes",
                    ),
                  ),
                actions: assign({
                  pageData: popLastChild,
                }),
                target: "kinder-router",
              },
              /**
               * Push dead children onto stack and loop
               */
              {
                target: "kinder-router",
                actions: assign({
                  pageData: ({ context }) => {
                    const node = getCurrentNode({ context });
                    const deadChildren =
                      node?.entries?.filter((c) => c.alive === "no") ?? [];
                    return {
                      nestedArrayHistory:
                        context.pageData?.nestedArrayHistory?.concat(
                          deadChildren.map(
                            (_) =>
                              ({
                                count: undefined,
                                entries: undefined,
                              }) as NestedKinder,
                          ),
                        ),
                    };
                  },
                }),
              },
            ],
          },
        },
      },
    },
    staatsangehoerigkeit: {
      id: "staatsangehoerigkeit",
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
