import { NavState, type NavItem } from "~/components/FlowNavigation";
import { getSubflowsEntries } from "~/models/flows/flows.server";
import { type buildFlowController } from "./flow/server/buildFlowController";
import _ from "lodash";
import { type Translations } from "./cms/index.server";

export function navItemsFromFlowSpecifics(
  currentStepId: string,
  flowController: ReturnType<typeof buildFlowController>,
  translation: Translations = {},
): NavItem[] {
  const currentFlow = flowController.getConfig();
  const flowId = currentFlow.id ?? "";

  return getSubflowsEntries(currentFlow).map(([rootStateName, flowEntry]) => {
    const subflows =
      "states" in flowEntry
        ? Object.entries(flowEntry.states ?? {}).filter(
            ([, state]) => "states" in state,
          )
        : [];

    const firstSubflowEntry = subflows.find(
      (entry) => entry[0] === flowEntry.initial,
    );

    const destinationStepId = `${rootStateName}/${
      typeof flowEntry.initial === "string" ? flowEntry.initial : ""
    }${
      firstSubflowEntry
        ? typeof firstSubflowEntry[1].initial === "string"
          ? `/${firstSubflowEntry[1].initial}`
          : ""
        : ""
    }`;

    const rootLabel = translation[rootStateName] ?? "No key";
    const subflowSpecifics =
      subflows.length > 0
        ? _.flatten(
            subflows.map((entry) => {
              const subflow = entry[1] ?? {};
              const subflowKey = entry[0] ?? "No key";
              return getSubflowSpecifics(
                rootStateName,
                subflow?.id ?? "",
                typeof subflow?.initial === "string" ? subflow?.initial : "",
                translation,
                subflowKey,
                flowId,
                currentStepId,
                flowController,
              );
            }),
          )
        : [];

    return {
      destination: flowId + destinationStepId,
      label: rootLabel,
      state: navState({
        isCurrent: currentStepId.startsWith(rootStateName),
        isReachable: flowController.isReachable(destinationStepId),
        isDone: flowController.isDone(rootStateName),
        isUneditable: flowController.isUneditable(rootStateName),
      }),
      subflows: subflowSpecifics,
    };
  });
}

function getSubflowSpecifics(
  rootStateName: string,
  id: string,
  initial: string,
  translation: Translations,
  subflowKey: string,
  flowId: string,
  currentStepId: string,
  flowController: ReturnType<typeof buildFlowController>,
) {
  const subflowRoot = `${rootStateName}/${id ?? ""}`;
  const subflowDestionationStepId = `${subflowRoot}/${initial ?? ""}`;

  const subflowState = flowController.getSubflowState(
    rootStateName,
    subflowKey,
  );

  return {
    destination: flowId + subflowDestionationStepId,
    label: translation[subflowRoot] ?? subflowKey,
    state: navState({
      isCurrent:
        currentStepId.startsWith(subflowRoot) &&
        currentStepId.at(subflowRoot.length) === "/", // subflows might start with the same name, this ensures the following characters
      isReachable: flowController.isReachable(subflowDestionationStepId),
      isDone: subflowState == "Done",
      isUneditable: flowController.isUneditable(subflowRoot),
    }),
  };
}

export function navState({
  isCurrent,
  isReachable,
  isDone,
  isUneditable,
}: {
  isCurrent: boolean;
  isReachable: boolean;
  isDone: boolean;
  isUneditable: boolean;
}) {
  if (isCurrent) return NavState.Current;
  if (isUneditable && isDone) return NavState.DoneDisabled;
  if (isReachable && isDone) return NavState.Done;
  if (isReachable) return NavState.Open;

  return NavState.OpenDisabled;
}
