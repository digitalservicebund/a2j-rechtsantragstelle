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
  const flowRoot = currentFlow.id ?? "";

  // eslint-disable-next-line sonarjs/cognitive-complexity
  return getSubflowsEntries(currentFlow).map(([rootStateName, flowEntry]) => {
    const subflows =
      "states" in flowEntry
        ? Object.entries(flowEntry.states ?? {}).filter(
            ([, state]) => "states" in state,
          )
        : [];

    const subflowEntry = subflows.find(
      (entry) => entry[0] === flowEntry.initial,
    );

    const destinationStepId = `${rootStateName}/${
      typeof flowEntry.initial === "string" ? flowEntry.initial : ""
    }${
      subflowEntry
        ? typeof subflowEntry[1].initial === "string"
          ? `/${subflowEntry[1].initial}`
          : ""
        : ""
    }`;

    const rootLabel = translation[rootStateName] ?? flowEntry.key ?? "No key";
    const subflowSpecifics =
      subflows.length > 0
        ? _.flatten(
            subflows.map((entry) => {
              const subflow = entry[1] ?? {};
              const subflowKey = entry[0] ?? "No key";
              const subflowRoot = `${rootStateName}/${subflow?.id ?? ""}`;
              const subflowDestionationStepId = `${subflowRoot}/${
                typeof subflow?.initial === "string" ? subflow?.initial : ""
              }`;
              const subflowLabel = translation[subflowRoot] ?? subflowKey;

              return {
                destination: flowRoot + subflowDestionationStepId,
                label: subflowLabel ?? subflowKey,
                state: navState({
                  isCurrent: currentStepId.startsWith(subflowRoot),
                  isReachable: true,
                  isDone: flowController.isSubflowDone(
                    rootStateName,
                    subflowKey,
                  ),
                  isUneditable: flowController.isUneditable(subflowRoot),
                }),
              };
            }),
          )
        : [];

    return {
      destination: flowRoot + destinationStepId,
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
