import classNames from "classnames";
import { type NavState } from "~/services/navigation/navState";
import { getStepStyles } from "./getStepStyles";

export const StepperTriangle = ({ state }: { state: NavState }) => {
  const styles = getStepStyles(state);
  return (
    <svg
      data-testid="triangle"
      className={classNames(
        "h-full z-1 h-full absolute right-[-1.25rem] w-[1.25rem] text-kern-neutral-025",
        styles.triangle,
      )}
      viewBox="1 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <polygon
        className="fill-current forced-colors:fill-[ButtonFace]"
        points="0,0 100,50 0,100"
      />
      <path
        className="text-kern-neutral-300 stroke-current stroke-3 forced-colors:stroke-[ButtonText]"
        d="M100 50 L0 0 M100 50 L0 100"
      />
    </svg>
  );
};
