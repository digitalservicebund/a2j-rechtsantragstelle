import classNames from "classnames";
import {
  NavState,
  stateIsCurrent,
  stateIsDone,
  stateIsWarning,
  stateIsDisabled,
} from "~/services/navigation/navState";

export function getStepStyles(state: NavState) {
  return {
    isCurrent: stateIsCurrent(state),
    isDone: stateIsDone(state),
    isWarning: stateIsWarning(state),
    isDisabled: stateIsDisabled(state),

    container: classNames(
      "arrow-step border border-kern-neutral-200 flex w-full relative",
      {
        "bg-kern-neutral-025 text-gray-400 pointer-events-none":
          stateIsDisabled(state),
        "bg-kern-feedback-warning": stateIsWarning(state),
        "bg-kern-neutral-200 font-semibold": stateIsCurrent(state),
      },
    ),

    circle: classNames(
      "flex justify-center items-center w-[20px] h-[20px] rounded-full mr-3",
      {
        "bg-kern-action-default text-white":
          stateIsCurrent(state) || stateIsDone(state),
        "bg-kern-neutral-400 text-white": stateIsDisabled(state),
      },
    ),

    triangle: classNames({
      "text-kern-neutral-200": stateIsCurrent(state),
      "text-kern-neutral-025": stateIsDisabled(state),
      "text-kern-feedback-warning": stateIsWarning(state),
    }),
  };
}
