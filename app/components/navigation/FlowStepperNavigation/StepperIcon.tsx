import { Icon } from "~/components/common/Icon";
import {
  type NavState,
  stateIsDone,
  stateIsWarning,
} from "~/services/navigation/navState";

export function StepperIcon({
  state,
  stepIndex,
}: Readonly<{
  state: NavState;
  stepIndex: number;
}>) {
  if (stateIsDone(state)) {
    return (
      <Icon
        name="check-circle"
        className="fill-kern-feedback-success forced-color-adjust-auto"
      />
    );
  }

  if (stateIsWarning(state)) {
    return (
      <Icon
        name="warning"
        className="fill-kern-feedback-warning forced-color-adjust-auto"
      />
    );
  }

  return <span>{stepIndex + 1}</span>;
}
