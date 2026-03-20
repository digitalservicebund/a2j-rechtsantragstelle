import { translations } from "~/services/translations/translations";
import { type StepStepper } from "../types";
import { arrayIsNonEmpty } from "~/util/array";
import { getStepStyles } from "./getStepStyles";
import { StepperContent } from "./StepperContent";
import { StepperTriangle } from "./StepperTriangle";

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
      <ol className={"flex max-w-full! pl-0"}>
        {steps.map(({ state, href, label }, stepIndex) => {
          const isLast = stepIndex === steps.length - 1;
          return (
            <li key={label} className={getStepStyles(state).container}>
              <StepperContent
                href={href}
                stepIndex={stepIndex}
                label={label}
                state={state}
              />
              {!isLast && <StepperTriangle state={state} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
