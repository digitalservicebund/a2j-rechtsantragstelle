import { type RefObject, useEffect, useRef } from "react";
import { NavigationList } from "~/components/kern/navigation/NavigationList";
import { translations } from "~/services/translations/translations";
import type { StepStepper, NavItem } from "./types";
import { arrayIsNonEmpty } from "~/util/array";
import {
  stateIsCurrent,
  stateIsActive,
  stateIsWarning,
} from "~/services/navigation/navState";
import { getMobileButtonAreaTitles } from "~/components/navigation/getMobileButtonAreaTitles";
import classNames from "classnames";
import { KernIcon } from "../common/KernIcon";

const DATA_TESTID_STEP_STEPPER_LINK = "step-stepper-link";

const StepStepperLinks = ({
  stepsStepper,
}: Readonly<{
  stepsStepper: StepStepper[];
}>) => {
  if (!arrayIsNonEmpty(stepsStepper)) {
    return null;
  }

  return (
    <div>
      {stepsStepper
        .map((step, index) => {
          return { ...step, stepIndex: index + 1 };
        })
        .filter(
          (steps) => !stateIsCurrent(steps.state) && stateIsActive(steps.state),
        )
        .map((step) => {
          const isWarningStep = stateIsWarning(step.state);
          return (
            <div className="flex flex-row pl-16 pr-0 pb-16" key={step.label}>
              <a
                href={step.href}
                className="truncate text-left mw-[70vw]"
                data-testid={DATA_TESTID_STEP_STEPPER_LINK}
                aria-describedby={isWarningStep ? step.href : undefined}
              >
                <KernIcon name="chevron-left" className="inline" />
                {`${translations.navigationMobile.toStep.de} ${step.label} (${step.stepIndex}/${stepsStepper.length})`}
              </a>
              {isWarningStep && (
                <KernIcon
                  name="warning"
                  className="pl-2 fill-kern-feedback-warning!"
                  aria-label={translations.navigation.navigationItemWarning.de}
                />
              )}
            </div>
          );
        })}
    </div>
  );
};

const keyDownOnLastLink = (
  summaryRef: RefObject<HTMLElement | null>,
  selector: string,
) => {
  const links = document.querySelectorAll<HTMLAnchorElement>(selector);

  if (links.length === 0) {
    return;
  }

  const lastLink = links[links.length - 1];

  if (lastLink) {
    lastLink.addEventListener("keydown", function (event: KeyboardEvent) {
      // Only tab without shiftKey
      if (event.key === "Tab" && !event.shiftKey) {
        setTimeout(function () {
          if (summaryRef.current !== null) {
            summaryRef.current.focus();
          }
        }, 10);
      }
    });
  }
};

export default function SideNavMobile({
  navItems,
  stepsStepper,
}: Readonly<{
  navItems: NavItem[];
  stepsStepper: StepStepper[];
}>) {
  const firstItemRef = useRef<HTMLAnchorElement | null>(null);
  const summaryRef = useRef<HTMLElement | null>(null);

  const { currentAreaTitle, currentNavTitle } = getMobileButtonAreaTitles(
    navItems,
    stepsStepper,
  );

  const hasStepsStepperLinks = stepsStepper.some(
    (steps) => !stateIsCurrent(steps.state) && stateIsActive(steps.state),
  );
  const keyDownSelector = `[data-testid=${hasStepsStepperLinks ? DATA_TESTID_STEP_STEPPER_LINK : "nav-item-link"}]`;

  const isStateCurrentWarning = arrayIsNonEmpty(stepsStepper)
    ? stepsStepper.some(({ state }) => state === "WarningCurrent")
    : navItems.some(({ state }) => state === "WarningCurrent");

  const focusFirstItem = (event: React.ToggleEvent<HTMLDetailsElement>) =>
    event.currentTarget.open && firstItemRef.current?.focus();

  useEffect(() => {
    keyDownOnLastLink(summaryRef, keyDownSelector);
  });

  return (
    <details
      className="group flex flex-col outline-none! open:min-h-screen justify-end bg-transparent"
      data-testid="side-nav-details"
      onToggle={focusFirstItem}
    >
      <summary
        className="flex flex-col cursor-pointer outline-none group/summary"
        aria-label={translations.navigationMobile.toggleMenu.de}
        data-testid="side-nav-summary"
        ref={summaryRef}
      >
        <div
          className="not-group-open:hidden min-h-screen flex bg-black opacity-70"
          data-testid="close-overlay"
        ></div>
        <div
          className={classNames(
            "flex bg-white items-center py-8 px-16 flex-row justify-between border border-kern-neutral-200 not-group-open:active:bg-kern-neutral-200!  forced-colors:group-focus-within/summary:border-[4px] forced-colors:group-focus-within/summary:border-[CanvasText]",
            {
              "not-group-open:bg-kern-orange-100! not-group-open:active:bg-kern-orange-100!":
                isStateCurrentWarning,
            },
          )}
        >
          <div className="flex flex-row gap-8">
            <div className="flex flex-col items-start">
              <span className="kern-body kern-body--bold kern-body--small truncate text-left w-[70vw]">
                {currentAreaTitle}
              </span>
              <span className="kern-body kern-body--small">
                {currentNavTitle}
              </span>
            </div>
          </div>
          <KernIcon
            name="keyboard-arrow-up"
            className="hidden group-open:block"
          />
          <KernIcon
            name="keyboard-arrow-down"
            className="block group-open:hidden"
          />
        </div>
      </summary>
      <div className="max-h-[80vh] bg-white overflow-auto">
        <div className="flex flex-col p-16">
          <NavigationList
            navItems={navItems}
            className="border border-kern-neutral-200 overflow-auto rounded-sm"
            firstItemRef={firstItemRef}
          />
        </div>
        <StepStepperLinks stepsStepper={stepsStepper} />
      </div>
    </details>
  );
}
