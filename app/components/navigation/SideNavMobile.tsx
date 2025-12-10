import { type RefObject, useEffect, useRef } from "react";
import { NavigationList } from "~/components/navigation/NavigationList";
import { translations } from "~/services/translations/translations";
import type { StepStepper, NavItem } from "./types";
import { StandaloneLink } from "../common/StandaloneLink";
import { arrayIsNonEmpty } from "~/util/array";
import {
  stateIsCurrent,
  stateIsActive,
  stateIsWarning,
} from "~/services/navigation/navState";
import KeyboardArrowLeft from "@digitalservicebund/icons/KeyboardArrowLeft";
import SvgWarningAmber from "@digitalservicebund/icons/WarningAmberRounded";
import { getMobileButtonAreaTitles } from "~/components/navigation/getMobileButtonAreaTitles";
import classNames from "classnames";
import KeyboardArrowDown from "@digitalservicebund/icons/KeyboardArrowDown";
import KeyboardArrowUp from "@digitalservicebund/icons/KeyboardArrowUp";

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
              <StandaloneLink
                url={step.href}
                className="ds-link-02-bold truncate text-left mw-[70vw]"
                icon={<KeyboardArrowLeft className="inline" />}
                text={`${translations.navigationMobile.toStep.de} ${step.label} (${step.stepIndex}/${stepsStepper.length})`}
                dataTestid={DATA_TESTID_STEP_STEPPER_LINK}
                aria-describedby={isWarningStep ? step.href : undefined}
              />
              {isWarningStep && (
                <SvgWarningAmber
                  data-testid="icon-warning"
                  className="pl-2"
                  id={step.href}
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

  const hasStepsStepper = arrayIsNonEmpty(stepsStepper);
  const keyDownSelector = `[data-testid=${hasStepsStepper ? DATA_TESTID_STEP_STEPPER_LINK : "nav-item-link"}]`;

  const isStateCurrentWarning = hasStepsStepper
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
        className="flex flex-col cursor-pointer w-full outline-none group/summary"
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
            "flex bg-white items-center py-8 px-16 flex-row w-full justify-between border border-blue-400 not-group-open:active:bg-blue-400 group-focus-within/summary:shadow-[inset_0_0_0_4px_#004b76] forced-colors:group-focus-within/summary:border-[4px] forced-colors:group-focus-within/summary:border-[CanvasText]",
            {
              "not-group-open:bg-yellow-200 not-group-open:active:bg-yellow-300":
                isStateCurrentWarning,
            },
          )}
        >
          <div className="flex flex-row gap-8">
            <div className="flex flex-col items-start">
              <span className="ds-label-02-bold truncate text-left w-[70vw]">
                {currentAreaTitle}
              </span>
              <span className="ds-body-03-reg text-gray-900">
                {currentNavTitle}
              </span>
            </div>
          </div>
          <KeyboardArrowUp className="hidden group-open:block h-[24px] text-blue-800 forced-colors:text-white" />
          <KeyboardArrowDown className="block group-open:hidden h-[24px] text-blue-800 forced-colors:text-white" />
        </div>
      </summary>
      <div className="max-h-[80vh] overflow-auto bg-white">
        <div className="pb-10 flex flex-col">
          <NavigationList
            navItems={navItems}
            className="border border-blue-400 mx-16 mb-10 overflow-auto"
            firstItemRef={firstItemRef}
          />
        </div>
        <StepStepperLinks stepsStepper={stepsStepper} />
      </div>
    </details>
  );
}
