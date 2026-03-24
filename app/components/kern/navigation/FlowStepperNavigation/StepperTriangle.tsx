import classNames from "classnames";
import { type NavState } from "~/services/navigation/navState";
import { getStepStyles } from "./getStepStyles";

export const StepperTriangle = ({ state }: { state: NavState }) => {
  const styles = getStepStyles(state);
  return (
    <div
      data-testid="triangle"
      aria-hidden="true"
      style={{
        position: "absolute",
        top: "-1.5px",
        bottom: "-.5px",
        right: "-1.25rem",
        width: "calc(1.5rem + 2px)",
        zIndex: 1,
      }}
    >
      <svg
        className={classNames("text-kern-neutral-025", styles.triangle)}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          overflow: "visible",
        }}
        viewBox="-3 0 21 51"
        focusable="false"
      >
        <path
          className="fill-current forced-colors:fill-[ButtonFace]"
          strokeWidth="0.5px"
          d="M-4 0 L0 0 Q2 0 4 2 L20 26 L4 50 Q2 52 0 50.75 L-4 50 Z"
        />
        <path
          className="text-kern-neutral-300 stroke-current forced-colors:stroke-[ButtonText]"
          strokeWidth="1.5px"
          fill="none"
          d="M1 0.75 L-4 0.25 Q3 0.25 4 2.5 L20 26 L4 49.5 Q3 50.9 0 50.9 L-4 50.9"
        />
      </svg>
    </div>
  );
};
