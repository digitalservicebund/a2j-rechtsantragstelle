import { useId } from "react";
import { type NavState } from "~/services/navigation/navState";
import { getStepStyles } from "./getStepStyles";
import { StepperIcon } from "./StepperIcon";
import { translations } from "~/services/translations/translations";

export function StepperContent({
  state,
  stepIndex,
  label,
  href,
  totalSteps,
}: Readonly<{
  state: NavState;
  stepIndex: number;
  label: string;
  href: string;
  totalSteps: number;
}>) {
  const iconId = useId();
  const styles = getStepStyles(state);

  const stepNumber = stepIndex + 1;

  const statusText = styles.isDone
    ? translations.navigation.navigationItemFinished.de
    : styles.isWarning
      ? translations.navigation.navigationItemWarning.de
      : "";

  const currentText = styles.isCurrent ? "current" : "";

  const ariaLabel = [
    `Step ${stepNumber} of ${totalSteps}`,
    label,
    statusText,
    currentText,
  ]
    .filter(Boolean)
    .join(", ");
  return (
    <a
      href={href}
      className="group w-full p-14 flex gap-8 justify-center items-center text-center no-underline outline-none"
      aria-disabled={styles.isDisabled}
      aria-current={styles.isCurrent ? "step" : undefined}
      aria-describedby={styles.isDone || styles.isWarning ? iconId : undefined}
      aria-label={ariaLabel}
    >
      <span className={styles.circle}>
        <StepperIcon state={state} stepIndex={stepIndex} />
      </span>

      <span className={styles.label}>{label}</span>
    </a>
  );
}
