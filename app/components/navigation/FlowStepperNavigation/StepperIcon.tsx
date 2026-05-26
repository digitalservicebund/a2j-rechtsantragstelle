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
        data-testid="icon-done"
        className="fill-kern-feedback-success forced-color-adjust-auto"
      />
    );
  }

  if (stateIsWarning(state)) {
    return (
      <Icon
        name="warning"
        data-testid="icon-warning"
        className="fill-kern-feedback-warning forced-color-adjust-auto"
      />
    );
  }

  return <>{stepIndex + 1}</>;
}
