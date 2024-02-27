// We have to differentiate between non- and nested steps.
// Nested steps are returned by xstate as an object, so they are concatenated to get a valid string
import type { StateValue } from "xstate";

// stepId: separates substates by "/": persoenliche-daten/anzahl (comes from pathname)
// stateId: separates substates by ".": persoenliche-daten.anzahl
// statepath: separates substates in array: [persoenliche-daten, anzahl]
// stateValue: xstate type StateValue = string | StateValueMap, ie: {persoenliche-daten: anzahl}
//  - non-nested states can be simple string (ie "start"). Also, the last state in a StateValueMap can be empty, ie {start: {}} or {persoenliche-daten: anzahl: {}}

export const stepIdToPath = (stepId: string) =>
  stepId.replace(/\//g, ".").replace("ergebnis.", "ergebnis/").split(".");

export const getStateValueString = (stateValue: StateValue): string => {
  if (typeof stateValue == "string") {
    return stateValue;
  } else if (Object.keys(stateValue).length == 1) {
    return [
      Object.keys(stateValue)[0],
      getStateValueString(Object.values(stateValue)[0] as StateValue),
    ].join("/");
  }
  throw Error("It is not expected to have other than one next (nested) step");
};

export const stateValueToStateId = (stateValue: StateValue): string => {
  if (typeof stateValue == "string") {
    return stateValue;
  } else if (Object.keys(stateValue).length == 1) {
    return [
      Object.keys(stateValue)[0],
      stateValueToStateId(Object.values(stateValue)[0] as StateValue),
    ].join(".");
  }
  throw Error("It is not expected to have other than one next (nested) step");
};
