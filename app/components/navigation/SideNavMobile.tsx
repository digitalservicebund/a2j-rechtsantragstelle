import { useEffect, useRef, useState } from "react";
import { NavigationList } from "~/components/navigation/NavigationList";
import { translations } from "~/services/translations/translations";
import type { StepStepper, NavItem } from "./types";
import { SideNavMobileButton } from "./SideNavMobileButton";
import { StandaloneLink } from "../common/StandaloneLink";
import { arrayIsNonEmpty } from "~/util/array";
import {
  stateIsCurrent,
  stateIsActive,
  stateIsWarning,
} from "~/services/navigation/navState";
import KeyboardArrowLeft from "@digitalservicebund/icons/KeyboardArrowLeft";
import SvgWarningAmber from "@digitalservicebund/icons/WarningAmberRounded";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const firstItemRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (menuOpen) {
      firstItemRef.current?.focus();
    }
  }, [menuOpen]);

  return (
    <div className={`flex flex-col lg:hidden`}>
      {menuOpen && (
        <button
          onClick={toggleMenu}
          data-testid="close-overlay"
          aria-label={translations.navigationMobile.closeMenu.de}
          className="bg-black h-screen opacity-70"
        />
      )}
      {/* col-reverse needed to preserve correct tab order 
       (top close button at the end of the tab order)*/}
      <div className="flex flex-col-reverse bg-white max-h-[80vh] border border-blue-400 overflow-auto">
        {menuOpen && (
          <>
            <StepStepperLinks stepsStepper={stepsStepper} />
            <div className="pb-10 flex flex-col">
              <NavigationList
                navItems={navItems}
                className="border border-blue-400 mx-16 mb-10 overflow-auto"
                firstItemRef={firstItemRef}
              />
            </div>
          </>
        )}
        <SideNavMobileButton
          navItems={navItems}
          menuOpen={menuOpen}
          toggleMenu={toggleMenu}
          stepsStepper={stepsStepper}
        />
      </div>
    </div>
  );
}
