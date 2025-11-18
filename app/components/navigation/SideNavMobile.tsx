import { useRef } from "react";
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
          return (
            <div className="flex flex-row pl-16 pr-0 pb-16" key={step.label}>
              <StandaloneLink
                url={step.href}
                className="ds-link-02-bold truncate text-left mw-[70vw]"
                icon={<KeyboardArrowLeft className="inline" />}
                text={`${translations.navigationMobile.toStep.de} ${step.label} (${step.stepIndex}/${stepsStepper.length})`}
              />
              {stateIsWarning(step.state) && (
                <SvgWarningAmber className="pl-2" />
              )}
            </div>
          );
        })}
    </div>
  );
};

export default function SideNavMobile({
  navItems,
  stepsStepper,
}: Readonly<{
  navItems: NavItem[];
  stepsStepper: StepStepper[];
}>) {
  const firstItemRef = useRef<HTMLAnchorElement | null>(null);

  const { currentAreaTitle, currentNavTitle } = getMobileButtonAreaTitles(
    navItems,
    stepsStepper,
  );

  const isStateCurrentWarning = arrayIsNonEmpty(stepsStepper)
    ? stepsStepper.some(({ state }) => state === "WarningCurrent")
    : navItems.some(({ state }) => state === "WarningCurrent");

  return (
    <details className="group flex flex-col lg:hidden bg-white border border-blue-400">
      {/* {menuOpen && (
        <button
          onClick={toggleMenu}
          data-testid="close-overlay"
          aria-label={translations.navigationMobile.closeMenu.de}
          className="bg-black h-screen opacity-70"
        />
      )} */}
      {/* col-reverse needed to preserve correct tab order 
       (top close button at the end of the tab order)*/}
      <summary
        className={classNames(
          "flex flex-row items-center not-group-open:not-bg-yellow-200 justify-between py-8 px-16 cursor-pointer w-full outline-none not-group-open:active:bg-blue-400 not-group-open:focus-within:shadow-[inset_0_0_0_4px_#004b76]",
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
      </summary>
      <div className="max-h-[80vh] overflow-auto">
        <StepStepperLinks stepsStepper={stepsStepper} />
        <div className="pb-10 flex flex-col">
          <NavigationList
            navItems={navItems}
            className="border border-blue-400 mx-16 mb-10 overflow-auto"
            firstItemRef={firstItemRef}
          />
        </div>
      </div>
    </details>
  );
}
