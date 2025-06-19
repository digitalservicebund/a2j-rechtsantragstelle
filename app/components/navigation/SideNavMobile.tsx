import Close from "@digitalservicebund/icons/Close";
import MenuIcon from "@digitalservicebund/icons/Menu";
import { useState } from "react";
import { NavigationList } from "~/components/navigation/NavigationList";
import { stateIsCurrent } from "~/services/navigation/navState";
import { translations } from "~/services/translations/translations";
import { type NavItem } from "./types";

type SideNavMobileProps = Readonly<{
  className?: string;
  navItems: NavItem[];
}>;

export default function SideNavMobile({
  className,
  navItems,
}: SideNavMobileProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const currentPageTitle = navItems.find(({ state }) =>
    stateIsCurrent(state),
  )?.label;

  const buttonClasses = "h-[24px] w-1/12 cursor-pointer text-blue-800";
  const Icon = menuOpen ? Close : MenuIcon;

  return (
    <div className={`flex flex-col ${className ?? ""}`}>
      {menuOpen && (
        <button
          onClick={toggleMenu}
          data-testid="close-overlay"
          aria-label={translations.navigationMobile.closeMenu.de}
          className="bg-black h-screen opacity-70"
        />
      )}

      <div className="bg-white max-h-[80vh] border-[1px] border-blue-400 overflow-auto">
        <button
          onClick={toggleMenu}
          aria-label={translations.navigationMobile.toggleMenu.de}
          className="flex items-center  gap-8 text-sm py-20 px-10 cursor-pointer w-full"
        >
          <Icon className={buttonClasses} />
          <span className="text-gray-900">
            {translations.navigationMobile.currentArea.de}:{" "}
          </span>
          <span className="font-semibold">{currentPageTitle}</span>
        </button>

        {menuOpen && (
          <div className="pb-10">
            <NavigationList
              navItems={navItems}
              className="border border-blue-400 mx-10 mb-10 overflow-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
}
