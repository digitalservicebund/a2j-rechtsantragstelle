import classNames from "classnames";
import {
  type NavState,
  stateIsCurrent,
  stateIsDone,
  stateIsWarning,
  stateIsDisabled,
  stateIsOpen,
} from "~/services/navigation/navState";

function getArrowBg(state: NavState): string {
  if (stateIsDisabled(state)) return "var(--color-kern-neutral-025)";
  if (state === "WarningCurrent") return "var(--color-kern-orange-100)";
  if (state === "Warning")
    return "var(--color-kern-feedback-warning-background)";
  if (state === "DoneCurrent") return "var(--color-kern-neutral-200)";
  if (state === "Done" || stateIsOpen(state))
    return "var(--color-kern-neutral-025)";
  return "var(--color-kern-neutral-100)";
}

function getArrowHoverBg(state: NavState): string {
  if (stateIsDisabled(state)) return getArrowBg(state);
  if (stateIsDone(state)) return "var(--color-kern-neutral-100)";
  if (stateIsWarning(state)) return "var(--color-kern-orange-100)";
  return "var(--color-kern-neutral-200)";
}

export function getStepStyles(state: NavState) {
  return {
    isCurrent: stateIsCurrent(state),
    isDone: stateIsDone(state),
    isWarning: stateIsWarning(state),
    isDisabled: stateIsDisabled(state),

    container: classNames(
      "border border-kern-neutral-300 flex w-full relative h-[48px] items-center",
      {
        "bg-kern-neutral-025 text-kern-neutral-400 pointer-events-none":
          stateIsDisabled(state),
        "stepper-step--warning": stateIsWarning(state),
        "bg-kern-feedback-warning-background hover:bg-kern-orange-100":
          state === "Warning",
        "bg-kern-orange-100": state === "WarningCurrent",
        "bg-kern-neutral-025": stateIsOpen(state),
        "bg-kern-neutral-100": state === "Current",
        "bg-kern-neutral-200": state === "DoneCurrent",
        "hover:bg-kern-neutral-100": stateIsDone(state),
        "hover:bg-kern-neutral-200":
          !stateIsWarning(state) &&
          !stateIsDisabled(state) &&
          !stateIsDone(state),
        "font-semibold": stateIsCurrent(state),
      },
    ),

    arrowBg: getArrowBg(state),
    arrowHoverBg: getArrowHoverBg(state),

    circle: classNames(
      "flex justify-center items-center w-[20px] h-[20px] rounded-full mr-3",
      {
        "bg-kern-action-default text-white":
          (stateIsCurrent(state) || stateIsOpen(state)) &&
          !stateIsWarning(state),
        "bg-white": stateIsDone(state),
        "bg-kern-neutral-400 text-white": stateIsDisabled(state),
        "forced-colors:outline-solid forced-colors:border-0":
          !stateIsDone(state) && !stateIsWarning(state),
      },
    ),

    label: classNames({
      "group-hover:underline": true,
    }),

    triangle: classNames({
      "text-kern-neutral-200": stateIsCurrent(state),
      "text-kern-neutral-025": stateIsDisabled(state),
      "text-kern-feedback-warning": stateIsWarning(state),
    }),
  };
}
