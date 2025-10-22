import KeyboardArrowDown from "@digitalservicebund/icons/KeyboardArrowDown";
import KeyboardArrowUp from "@digitalservicebund/icons/KeyboardArrowUp";
import { translations } from "~/services/translations/translations";
import type { NavItem, StepStepper } from "./types";
import { getMobileButtonAreaTitles } from "./getMobileButtonAreaTitles";
import { arrayIsNonEmpty } from "~/util/array";
import classNames from "classnames";

type Props = Readonly<{
  menuOpen: boolean;
  navItems: NavItem[];
  toggleMenu: () => void;
  stepsStepper?: StepStepper[];
}>;

export const SideNavMobileButton = ({
  menuOpen,
  navItems,
  toggleMenu,
  stepsStepper,
}: Props) => {
  const Icon = menuOpen ? KeyboardArrowUp : KeyboardArrowDown;

  const { currentAreaTitle, nextAreaTitle, stepStepperIndex } =
    getMobileButtonAreaTitles(navItems, stepsStepper);

  const isStateCurrentWarning = arrayIsNonEmpty(stepsStepper)
    ? stepsStepper.some(({ state }) => state === "WarningCurrent")
    : navItems.some(({ state }) => state === "WarningCurrent");

  return (
    <button
      onClick={toggleMenu}
      aria-expanded={menuOpen}
      className={classNames(
        "flex flex-row items-center justify-between py-8 px-16 cursor-pointer w-full active:bg-blue-400 side-nav-mobile-button",
        {
          "bg-yellow-200 active:bg-yellow-300": isStateCurrentWarning,
        },
      )}
    >
      <div className="flex flex-row gap-8">
        {stepStepperIndex && (
          <span className="flex justify-center items-center w-[24px] h-[24px] rounded-full forced-colors:outline-solid forced-colors:border-0 bg-blue-800 text-white">
            {stepStepperIndex}
          </span>
        )}
        <div className="flex flex-col items-start">
          <span className="ds-label-02-bold truncate text-left w-[70vw]">
            {currentAreaTitle}
          </span>

          {nextAreaTitle.length > 0 && (
            <span className="ds-body-03-reg text-gray-900">
              {translations.navigationMobile.after.de}: {nextAreaTitle}
            </span>
          )}
        </div>
      </div>

      <Icon className={"h-[24px] text-blue-800"} />
    </button>
  );
};
