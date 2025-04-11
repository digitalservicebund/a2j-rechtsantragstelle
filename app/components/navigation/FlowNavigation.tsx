import classNames from "classnames";
import type { FlowNavigationProps } from "~/components/navigation/NavigationList";
import { NavigationList } from "~/components/navigation/NavigationList";
import SideNavMobile from "~/components/navigation/SideNavMobile";
import { useJsAvailable } from "~/services/useJsAvailabe";

export default function FlowNavigation(props: FlowNavigationProps) {
  const jsAvailable = useJsAvailable();

  return (
    <nav
      aria-label={props.a11yLabels?.menuLabel}
      className={classNames("w-full md:border-[1px] md:border-blue-400", {
        "fixed bottom-0 z-50 md:static md:z-auto": jsAvailable,
      })}
    >
      {jsAvailable && (
        <SideNavMobile
          className="md:hidden"
          labels={props.mobileLabels}
          navItems={props.navItems}
        />
      )}

      <NavigationList
        {...props}
        className={classNames("md:block", { hidden: jsAvailable })}
      />
    </nav>
  );
}
