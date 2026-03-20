import classNames from "classnames";
import {
  type NavState,
  stateIsCurrent,
  stateIsDone,
  stateIsWarning,
  stateIsDisabled,
  stateIsOpen,
} from "~/services/navigation/navState";

export function getStepStyles(state: NavState) {
  return {
    isCurrent: stateIsCurrent(state),
    isDone: stateIsDone(state),
    isWarning: stateIsWarning(state),
    isDisabled: stateIsDisabled(state),

    container: classNames(
      "border border-kern-neutral-200 flex w-full relative group before:absolute before:inset-x-0 before:bottom-0 before:h-[4px]",
      {
        "bg-kern-neutral-025 text-kern-neutral-400 pointer-events-none":
          stateIsDisabled(state),
        "bg-kern-feedback-warning": stateIsWarning(state),
        "bg-kern-neutral-200 font-semibold": stateIsCurrent(state),
      },
    ),

    circle: classNames(
      "flex justify-center items-center w-[20px] h-[20px] rounded-full mr-3",
      {
        "bg-kern-action-default text-white":
          stateIsCurrent(state) || stateIsOpen(state),
        "bg-white": stateIsDone(state),
        "bg-kern-neutral-400 text-white": stateIsDisabled(state),
        "forced-colors:outline-solid forced-colors:border-0":
          !stateIsDone(state) && !stateIsWarning(state),
      },
    ),

    triangle: classNames({
      "text-kern-neutral-200": stateIsCurrent(state),
      "text-kern-neutral-025": stateIsDisabled(state),
      "text-kern-feedback-warning": stateIsWarning(state),
    }),
  };
}
