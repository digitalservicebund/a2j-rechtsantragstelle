import classNames from "classnames";
import { useEffect, useState } from "react";
import type { FlowNavigationProps } from "~/components/navigation/NavigationList";
import { NavigationList } from "~/components/navigation/NavigationList";
import SideNavMobile from "~/components/navigation/SideNavMobile";

export default function FlowNavigation(props: FlowNavigationProps) {
  const [jsAvailable, setJsAvailable] = useState(false);
  useEffect(() => {
    setJsAvailable(true);
  }, []);

  return (
    <nav role="navigation" aria-label={props.a11yLabels?.menuLabel}>
      {jsAvailable && (
        <SideNavMobile
          className="fixed bottom-0 w-full md:hidden z-50"
          labels={props.mobileLabels}
          navItems={props.navItems}
        />
      )}

      <NavigationList
        {...props}
        className={classNames(
          "md:block md:ml-32 md:mr-0 mb-32 mx-[5vw] bg-white border-[1px] border-blue-400",
          { hidden: jsAvailable },
        )}
      />
    </nav>
  );
}
