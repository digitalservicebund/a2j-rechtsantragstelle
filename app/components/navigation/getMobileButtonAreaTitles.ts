import { stateIsCurrent } from "~/services/navigation/navState";
import type { NavItem, StepStepper } from "./types";
import { arrayIsNonEmpty } from "~/util/array";

const getCurrentNavTitle = (navItems: NavItem[]): string => {
  const current = navItems.find(({ state }) => stateIsCurrent(state));
  return current?.label ?? "";
};

export const getMobileButtonAreaTitles = (
  navItems: NavItem[],
  stepsStepper?: StepStepper[],
): {
  currentAreaTitle: string;
  currentNavTitle: string;
} => {
  const currentNavTitle = getCurrentNavTitle(navItems);

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
