import classNames from "classnames";
import { useRouteLoaderData } from "react-router";
import { NavigationList } from "~/components/navigation/NavigationList";
import SideNavMobile from "~/components/navigation/SideNavMobile";
import { type RootLoader } from "~/root";
import { type FlowNavigationProps } from "./types";

export default function FlowNavigation(props: FlowNavigationProps) {
  const rootLoaderData = useRouteLoaderData<RootLoader>("root");

  return (
    <nav
      aria-label={rootLoaderData?.accessibilityTranslations?.navigationLabel}
      className={
        "fixed left-0 bottom-0 z-50 w-full lg:border lg:static lg:z-auto lg:border-blue-400 print:hidden"
      }
    >
      <SideNavMobile
        navItems={props.navItems}
        stepsStepper={props.stepsStepper}
      />

      <NavigationList {...props} className={classNames("hidden lg:block")} />
    </nav>
  );
}
