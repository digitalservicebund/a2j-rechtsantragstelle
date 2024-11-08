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
