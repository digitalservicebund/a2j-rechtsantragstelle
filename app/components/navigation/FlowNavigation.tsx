import classNames from "classnames";
import { useRouteLoaderData } from "react-router";
import { NavigationList } from "~/components/navigation/NavigationList";
import SideNavMobile from "~/components/navigation/SideNavMobile";
import { type RootLoader } from "~/root";
import { useJsAvailable } from "~/services/useJsAvailable";
import { type FlowNavigationProps } from "./types";

export default function FlowNavigation(props: FlowNavigationProps) {
  const jsAvailable = useJsAvailable();

  const rootLoaderData = useRouteLoaderData<RootLoader>("root");

  return (
    <nav
      aria-label={rootLoaderData?.accessibilityTranslations?.menuLabel}
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
