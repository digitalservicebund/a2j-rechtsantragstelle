import KeyboardArrowDown from "@digitalservicebund/icons/KeyboardArrowDown";
import KeyboardArrowUp from "@digitalservicebund/icons/KeyboardArrowUp";
import { stateIsCurrent } from "~/services/navigation/navState";
import { translations } from "~/services/translations/translations";
import { type NavItem } from "./types";

type Props = Readonly<{
  menuOpen: boolean;
  navItems: NavItem[];
  toggleMenu: () => void;
}>;

const getButtonNavTitles = (navItems: NavItem[]) => {
  const currentNavItemsIndex = navItems.findIndex(({ state }) =>
    stateIsCurrent(state),
  );

  if (currentNavItemsIndex === -1) {
    return {
      currentNavTitle: "",
      nextNavTitle: "",
    };
  }

  return {
    currentNavTitle: navItems[currentNavItemsIndex].label ?? "",
    nextNavTitle:
      currentNavItemsIndex + 1 < navItems.length
        ? (navItems[currentNavItemsIndex + 1].label ?? "")
        : "",
  };
};

export const SideNavMobileButton = ({
  menuOpen,
  navItems,
  toggleMenu,
}: Props) => {
  const Icon = menuOpen ? KeyboardArrowUp : KeyboardArrowDown;

  const { currentNavTitle, nextNavTitle } = getButtonNavTitles(navItems);

  return (
    <button
      onClick={toggleMenu}
      aria-expanded={menuOpen}
      className="flex flex-row items-center justify-between py-8 px-16 cursor-pointer w-full"
    >
      <div className="flex flex-col items-start">
        <span className="ds-label-02-bold">{currentNavTitle}</span>
        {nextNavTitle.length > 0 && (
          <span
            data-testid="next-nav-item"
            className="ds-body-03-reg text-gray-900"
          >
            {translations.navigationMobile.after.de}: {nextNavTitle}
          </span>
        )}
      </div>

      <Icon className={"h-[24px] text-blue-800"} />
    </button>
  );
};
