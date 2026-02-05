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
  if ((context.pageData?.nestedArrayHistory?.length ?? 0) > 0) {
    console.log("popping child!");
    const { pageData } = context;
    const newTraversalIndices = pageData?.traversalIndices
      ? pageData.traversalIndices.slice(0, -1)
      : [];
    const newTraversalDepth =
      newTraversalIndices.length === 0
        ? (pageData?.traversalDepth ?? 1) - 1
        : (pageData?.traversalDepth ?? 0);
    return {
      nestedArrayHistory: pageData?.nestedArrayHistory
        ? pageData.nestedArrayHistory.slice(0, -1)
        : [],
      traversalIndices: newTraversalIndices,
      traversalDepth: newTraversalDepth,
    };
  }
  return context.pageData;
};

const addDeadChildrenToStack = ({
  context,
}: {
  context: ErbscheinWegweiserUserData;
}) => {
  console.log("more dead kids");
  const node = getCurrentNode({ context });
  const deadChildrenIndices: number[] = [];
  const deadChildren: NestedKinder[] = [];
  node?.entries?.forEach(({ alive }, idx) => {
    if (alive === "no") {
      deadChildrenIndices.push(idx);
      deadChildren.push({
        count: undefined,
        entries: undefined,
      } as NestedKinder);
    }
  });
  return {
    nestedArrayHistory: context.pageData?.nestedArrayHistory
      ? context.pageData.nestedArrayHistory.concat(deadChildren)
      : deadChildren,
    traversalIndices: context.pageData?.traversalIndices
      ? context.pageData.traversalIndices.concat(deadChildrenIndices)
      : deadChildrenIndices,
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
      id: stepIds.start,
      on: { SUBMIT: "kinder-recursion" },
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
              actions: assign({
                pageData: ({ context }) => ({
                  ...context.pageData,
                  traversalDepth: (context.pageData?.traversalDepth ?? -1) + 1,
                }),
              }),
            },
            /**
             * Children have already been defined, pop last item from history and loop
             */
            {
              target: "kinder-router",
              guard: ({ context }) => {
                const currentNode = getCurrentNode({ context });
                return (
                  currentNode?.count !== undefined &&
                  currentNode.entries !== undefined
                );
              },
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
            BACK: "#start", // TODO: figure out back logic
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
                  getCurrentNode({ context })?.entries !== undefined &&
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
                guard: ({ context }) =>
                  getCurrentNode({ context })?.entries !== undefined &&
                  Boolean(
                    getCurrentNode({ context })?.entries?.some(
                      (c) => c.alive === "no",
                    ),
                  ),
                actions: assign({
                  pageData: addDeadChildrenToStack,
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
