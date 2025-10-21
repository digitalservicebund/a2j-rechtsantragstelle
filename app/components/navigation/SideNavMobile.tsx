import { useEffect, useRef, useState } from "react";
import { NavigationList } from "~/components/navigation/NavigationList";
import { translations } from "~/services/translations/translations";
import { type NavItem } from "./types";
import { SideNavMobileButton } from "./SideNavMobileButton";

export default function SideNavMobile({
  navItems,
}: Readonly<{
  navItems: NavItem[];
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
          <div className="pb-10 flex flex-col">
            <NavigationList
              navItems={navItems}
              className="border border-blue-400 mx-10 mb-10 overflow-auto"
              firstItemRef={firstItemRef}
            />
          </div>
        )}
        <SideNavMobileButton
          navItems={navItems}
          menuOpen={menuOpen}
          toggleMenu={toggleMenu}
        />
      </div>
    </div>
  );
}
