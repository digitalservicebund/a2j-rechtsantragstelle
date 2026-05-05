import { stateIsCurrent } from "~/services/navigation/navState";
import { arrayIsNonEmpty } from "~/util/array";
import { type NavItem, type StepStepper } from "./types";

export const getMobileButtonAreaTitles = (
  navItems: NavItem[],
  stepsStepper?: StepStepper[],
): {
  currentAreaTitle: string;
  currentNavTitle: string;
} => {
  const currentNavTitle =
    navItems.find(({ state }) => stateIsCurrent(state))?.label ?? "";

  if (!arrayIsNonEmpty(stepsStepper)) {
    return {
      currentAreaTitle: currentNavTitle,
      currentNavTitle: "",
    };
  }

  const currentAreaStepStepperIndex = stepsStepper.findIndex(({ state }) =>
    stateIsCurrent(state),
  );
  const qtyStepsStepper = stepsStepper.length;

  if (currentAreaStepStepperIndex === -1) {
    return {
      currentAreaTitle: "",
      currentNavTitle: "",
    };
  }

  const stepStepperIndex = currentAreaStepStepperIndex + 1;

  return {
    currentAreaTitle: `${stepsStepper[currentAreaStepStepperIndex].label} (${stepStepperIndex}/${qtyStepsStepper})`,
    currentNavTitle,
  };
};
