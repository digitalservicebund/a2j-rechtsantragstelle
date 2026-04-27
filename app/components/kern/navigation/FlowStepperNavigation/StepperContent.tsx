import { useId } from "react";
import { type NavState } from "~/services/navigation/navState";
import { getStepStyles } from "./getStepStyles";
import { StepperIcon } from "./StepperIcon";

export function StepperContent({
  state,
  stepIndex,
  label,
  href,
}: Readonly<{
  state: NavState;
  stepIndex: number;
  label: string;
  href: string;
}>) {
  const iconId = useId();
  const styles = getStepStyles(state);

  return (
    <a
      href={href}
      className="group w-full p-14 flex gap-8 justify-center items-center text-center outline-none no-underline"
      aria-disabled={styles.isDisabled}
      aria-current={styles.isCurrent}
      aria-describedby={styles.isDone || styles.isWarning ? iconId : undefined}
    >
      <span className={styles.circle}>
        <StepperIcon state={state} stepIndex={stepIndex} />
      </span>

      <span className={styles.label}>{label}</span>
    </a>
  );
}
