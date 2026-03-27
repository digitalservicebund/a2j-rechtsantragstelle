import classNames from "classnames";
import { translations } from "~/services/translations/translations";
import { type StepStepper } from "../types";
import { arrayIsNonEmpty } from "~/util/array";
import { getStepStyles } from "./getStepStyles";
import { StepperContent } from "./StepperContent";

type Props = {
  steps: StepStepper[];
};
export const FlowStepperNavigation = ({ steps }: Props) => {
  if (!arrayIsNonEmpty(steps)) {
    return null;
  }
  return (
    <nav
      aria-label={translations.navigation.navigationStepper.de}
      className="w-full print:hidden"
    >
      <ol className="flex max-w-full! pl-0">
        {steps.map(({ state, href, label }, stepIndex) => {
          const isFirst = stepIndex === 0;
          const isLast = stepIndex === steps.length - 1;
          const styles = getStepStyles(state);
          return (
            <li
              tabIndex={0}
              key={label}
              className={classNames(styles.container, {
                "border-r-0 stepper-step": !isLast,
                "rounded-l-sm": isFirst,
                "rounded-r-sm": isLast,
              })}
              style={{
                zIndex: steps.length - stepIndex,
                ["--stepper-step-bg" as string]: styles.arrowBg,
              }}
            >
              <StepperContent
                href={href}
                stepIndex={stepIndex}
                label={label}
                state={state}
              />
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
