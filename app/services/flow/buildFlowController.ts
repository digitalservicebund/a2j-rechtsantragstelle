import type { MachineConfig } from "xstate";
import { createMachine } from "xstate";
import { getShortestPaths } from "@xstate/graph";

type GetStateMachineArgs = {
  config: MachineConfig<any, any, any>;
  context: any;
  guards?: any;
};

const getStateMachine = ({ config, context, guards }: GetStateMachineArgs) => {
  const stateMachineConfig = {
    ...config,
    predictableActionArguments: true,
    context,
  };

  return createMachine(stateMachineConfig, {
    guards,
  });
};

const getSteps = (machine: any) => {
  return Object.values(
    getShortestPaths(machine, {
      events: { SUBMIT: [{ type: "SUBMIT" }] },
    })
  ).map(({ state }) => state.value);
};

type BuildFlowControllerArgs = {
  flow: MachineConfig<any, any, any>; // TODO correct type
  currentStepId: string;
  data: any; // TODO correct type
  guards?: any;
};

export const buildFlowController = ({
  flow,
  currentStepId,
  data,
  guards,
}: BuildFlowControllerArgs) => {
  const machine = getStateMachine({
    config: flow,
    context: data,
    guards,
  });

  const baseUrl = flow.id;

  return {
    isInitial: () => flow.initial === currentStepId,
    isFinal: () => machine.getStateNodeByPath(currentStepId).type === "final",
    isReachable: () => getSteps(machine).includes(currentStepId),
    getPrevious: () => {
      if (
        !("BACK" in (machine.getStateNodeByPath(currentStepId).config.on || {}))
      )
        throw new Error("no previous step configured");
      const name = machine.transition(currentStepId, { type: "BACK" })
        .value as string;
      return { name, url: `${baseUrl}${name}` };
    },
    getNext: () => {
      if (
        !(
          "SUBMIT" in
          (machine.getStateNodeByPath(currentStepId).config.on || {})
        )
      )
        throw new Error("no next step configured");
      const name = machine.transition(currentStepId, { type: "SUBMIT" })
        .value as string;
      return { name, url: `${baseUrl}${name}` };
    },
    getInitial: () => {
      const name = flow.initial;
      return { name, url: `${baseUrl}${String(name)}` };
    },
    getLastReachable: () => {
      const name = getSteps(machine).at(-1);
      return { name, url: `${baseUrl}${String(name)}` };
    },
    getProgress: () => {
      const total =
        Math.max(
          ...Object.values(machine.states)
            .map((n) => n.meta?.progressPosition)
            .filter((p) => p)
        ) + 1;
      const node = machine.getStateNodeByPath(currentStepId);
      const current =
        node.type === "final" ? total : node.meta?.progressPosition;
      return { total, current };
    },
  };
};
