import classNames from "classnames";
import { useRouteLoaderData } from "react-router";
import { NavigationList } from "~/components/navigation/NavigationList";
import SideNavMobile from "~/components/navigation/SideNavMobile";
import { type RootLoader } from "~/root";
import { type FlowNavigationProps } from "./types";
import { useJsAvailable } from "../hooks/useJsAvailable";

export default function FlowNavigation(props: FlowNavigationProps) {
  const jsAvailable = useJsAvailable();

  const rootLoaderData = useRouteLoaderData<RootLoader>("root");

  return (
    <nav
      aria-label={rootLoaderData?.accessibilityTranslations?.navigationLabel}
      className={classNames(
        "w-full lg:border lg:border-blue-400 print:hidden",
        {
          "fixed left-0 bottom-0 z-50 lg:static lg:z-auto": jsAvailable,
        },
      )}
    >
      {jsAvailable && (
        <SideNavMobile
          navItems={props.navItems}
          userVisitedValidationPage={props.userVisitedValidationPage}
        />
      )}

      <NavigationList
        {...props}
        className={classNames("lg:block", {
          hidden: jsAvailable,
          "hidden lg:block": !jsAvailable,
        })}
      />
    </nav>
  );
}
