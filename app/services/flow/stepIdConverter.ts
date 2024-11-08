import type { StateValue } from "xstate";

// stepId: separates substates by "/": persoenliche-daten/anzahl (comes from pathname)
// stateId: separates substates by ".": persoenliche-daten.anzahl
// statepath: separates substates in array: [persoenliche-daten, anzahl]
// stateValue: xstate type StateValue = string | StateValueMap, ie: {persoenliche-daten: anzahl}
// - non-nested states can be simple string (ie "start")

export const stepIdToPath = (stepId: string) =>
  stepId.replace(/\//g, ".").replace("ergebnis.", "ergebnis/").split(".");

export const stateValueToStepIds = (stateValue: StateValue): string[] => {
  if (typeof stateValue == "string") {
    return [stateValue];
  }
  if (Object.keys(stateValue).length == 0) {
    return [""];
  }
  return Object.entries(stateValue)
    .map(([key, value]) =>
      stateValueToStepIds(value as StateValue).map((substate) =>
        substate ? [key, substate].join("/") : key,
      ),
    )
    .flat();
};

export function insertIndexesIntoPath(
  currentPath: string,
  destinationPath: string,
) {
  const currentPathParts = currentPath.split("/");
  const destinationPathParts = destinationPath.split("/");

  let insertedIndices = 0;
  const outputPathParts: string[] = [];

  destinationPathParts.forEach((destinationPart, idx) => {
    const currentPart = currentPathParts[idx + insertedIndices];
    const previousPart = currentPathParts[idx + insertedIndices - 1];

    // Insert current path segment if its an integer and the previous one matches
    if (
      destinationPart !== currentPart &&
      destinationPathParts[idx - 1] === previousPart &&
      parseInt(currentPart)
    ) {
      outputPathParts.push(currentPart);
      insertedIndices += 1; // account for shift in path length
    }
    outputPathParts.push(destinationPart);
  });

  return outputPathParts.join("/");
}
