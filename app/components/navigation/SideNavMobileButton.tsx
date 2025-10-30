import KeyboardArrowDown from "@digitalservicebund/icons/KeyboardArrowDown";
import KeyboardArrowUp from "@digitalservicebund/icons/KeyboardArrowUp";
import type { NavItem, StepStepper } from "./types";
import { getMobileButtonAreaTitles } from "./getMobileButtonAreaTitles";
import { arrayIsNonEmpty } from "~/util/array";
import classNames from "classnames";

type Props = Readonly<{
  menuOpen: boolean;
  navItems: NavItem[];
  toggleMenu: () => void;
  stepsStepper: StepStepper[];
}>;

export const SideNavMobileButton = ({
  menuOpen,
  navItems,
  toggleMenu,
  stepsStepper,
}: Props) => {
  const Icon = menuOpen ? KeyboardArrowUp : KeyboardArrowDown;

  const { currentAreaTitle, currentNavTitle } = getMobileButtonAreaTitles(
    navItems,
    stepsStepper,
  );

  const isStateCurrentWarning = arrayIsNonEmpty(stepsStepper)
    ? stepsStepper.some(({ state }) => state === "WarningCurrent")
    : navItems.some(({ state }) => state === "WarningCurrent");

  return (
    <button
      onClick={toggleMenu}
      aria-expanded={menuOpen}
      className={classNames(
        "flex flex-row items-center justify-between py-8 px-16 cursor-pointer w-full outline-none",
        {
          "bg-yellow-200 active:bg-yellow-300":
            isStateCurrentWarning && !menuOpen,
        },
        {
          "active:bg-blue-400 focus-within:shadow-[inset_0_0_0_4px_#004b76]":
            !menuOpen,
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

      <Icon className={"h-[24px] text-blue-800 forced-colors:text-white"} />
    </button>
  );
};
