import {
  type NavState,
  stateIsDone,
  stateIsWarning,
} from "~/services/navigation/navState";
import { translations } from "~/services/translations/translations";
import { KernIcon } from "../../common/KernIcon";

export function StepperIcon({
  state,
  stepIndex,
}: Readonly<{
  state: NavState;
  stepIndex: number;
}>) {
  if (stateIsDone(state)) {
    return (
      <KernIcon
        name="check-circle"
        data-testid="icon-done"
        className="fill-kern-feedback-success forced-color-adjust-auto"
        aria-label={translations.navigation.navigationItemFinished.de}
      />
    );
  }

  if (stateIsWarning(state)) {
    return (
      <KernIcon
        name="warning"
        data-testid="icon-warning"
        className="fill-kern-feedback-warning forced-color-adjust-auto"
        aria-label={translations.navigation.navigationItemWarning.de}
      />
    );
  }

  return <>{stepIndex + 1}</>;
}
