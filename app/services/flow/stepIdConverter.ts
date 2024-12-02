import type { StateValue } from "xstate";

// stepId: separates substates by "/": /parentState/childState (so pathname = flowId+stepId)
// stateId: machine.id followed by state ids separated by ".": machineId.parentState.childState
// statePath: separates substates in array: [parentState, childState]
// stateValue: either stateName (if non-nested) or StateValueMap ({parentState: childState})

export const stepIdToPath = (stepId: string) =>
  stepId
    .slice(1)
    .replaceAll("/", ".")
    .replace("ergebnis.", "ergebnis/")
    .split(".");

export const stateValueToStepIds = (stateValue: StateValue): string[] => {
  if (typeof stateValue == "string") {
    return ["/" + stateValue];
  }
  if (Object.keys(stateValue).length == 0) {
    return [""];
  }
  return Object.entries(stateValue)
    .map(([key, value]) =>
      stateValueToStepIds(value!).map(
        (substate) => "/" + (substate ? key + substate : key),
      ),
    )
    .flat();
};

export const stateIdToStepId = (stateId: string, machineId: string) =>
  stateId.replace(machineId, "").replaceAll(".", "/");

export function insertIndexesIntoPath(
  currentPath: string,
  destinationPath: string,
  arrayIndexes: number[],
) {
  const currentPathParts = currentPath.split("/");
  const destinationPathParts = destinationPath.split("/");
  const numberPositions: number[] = [];

  currentPathParts.forEach((part, index) => {
    if (!isNaN(Number(part)) && part !== "") {
      numberPositions.push(index);
    }
  });
  let indexesInserted = 0;
  for (let i = 0; i < destinationPathParts.length; i++) {
    if (numberPositions.includes(i + indexesInserted)) {
      destinationPathParts.splice(
        i + indexesInserted,
        0,
        arrayIndexes[indexesInserted].toString(),
      );
      indexesInserted++;
    }
  }
  return destinationPathParts.join("/");
}
