import { stateIsCurrent } from "~/services/navigation/navState";
import type { NavItem, StepStepper } from "./types";
import { arrayIsNonEmpty } from "~/util/array";

const getNavItemsTitles = (navItems: NavItem[]) => {
  const currentNavItemsIndex = navItems.findIndex(({ state }) =>
    stateIsCurrent(state),
  );

  if (currentNavItemsIndex === -1) {
    return {
      currentNavTitle: "",
      nextNavTitle: "",
    };
  }

  return {
    currentNavTitle: navItems[currentNavItemsIndex].label ?? "",
    nextNavTitle:
      currentNavItemsIndex + 1 < navItems.length
        ? (navItems[currentNavItemsIndex + 1].label ?? "")
        : "",
  };
};

export const getMobileButtonAreaTitles = (
  navItems: NavItem[],
  stepsStepper?: StepStepper[],
) => {
  const { currentNavTitle, nextNavTitle } = getNavItemsTitles(navItems);

  if (arrayIsNonEmpty(stepsStepper)) {
    const currentAreaStepStepperIndex = stepsStepper.findIndex(({ state }) =>
      stateIsCurrent(state),
    );
    const qtdStepsStepper = stepsStepper.length;

    if (currentAreaStepStepperIndex === -1) {
      return {
        currentAreaTitle: "",
        nextAreaTitle: "",
      };
    }

    const stepStepperIndex = currentAreaStepStepperIndex + 1;

    return {
      currentAreaTitle: `${stepsStepper[currentAreaStepStepperIndex].label} (${stepStepperIndex}/${qtdStepsStepper}): ${currentNavTitle}`,
      nextAreaTitle:
        stepStepperIndex < stepsStepper.length
          ? `${stepsStepper[stepStepperIndex].label} (${stepStepperIndex + 1}/${qtdStepsStepper})`
          : "",
      stepStepperIndex,
    };
  }

  return {
    currentAreaTitle: currentNavTitle,
    nextAreaTitle: nextNavTitle,
  };
};
