// We have to differentiate between non- and nested steps.
// Nested steps are returned by xstate as an object, so they are concatenated to get a valid string
import type { StateValue } from "xstate";

export const getStateValueString = (stateValue: StateValue) => {
  if (typeof stateValue == "string") {
    return stateValue;
  } else if (Object.keys(stateValue).length == 1) {
    return Object.entries(stateValue)[0].join(".");
  }
  throw Error("It is not expected to have other than one next (nested) step");
};
