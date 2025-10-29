import { stateIsCurrent } from "~/services/navigation/navState";
import type { NavItem, StepStepper } from "./types";
import { arrayIsNonEmpty } from "~/util/array";

export const getMobileButtonAreaTitles = (
  navItems: NavItem[],
  stepsStepper?: StepStepper[],
): {
  currentAreaTitle: string;
  currentNavTitle: string;
} => {
  const currentNavTitle =
    navItems.find(({ state }) => stateIsCurrent(state))?.label ?? "";

  if (arrayIsNonEmpty(stepsStepper)) {
    const currentAreaStepStepperIndex = stepsStepper.findIndex(({ state }) =>
      stateIsCurrent(state),
    );
    const qtdStepsStepper = stepsStepper.length;

    if (currentAreaStepStepperIndex === -1) {
      return {
        currentAreaTitle: "",
        currentNavTitle: "",
      };
    }

    const stepStepperIndex = currentAreaStepStepperIndex + 1;

    return {
      currentAreaTitle: `${stepsStepper[currentAreaStepStepperIndex].label} (${stepStepperIndex}/${qtdStepsStepper})`,
      currentNavTitle,
    };
  }

  return {
    currentAreaTitle: currentNavTitle,
    currentNavTitle: "",
  };
};
