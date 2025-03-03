import type { FlowNavigationProps } from "~/components/navigation/NavigationList";
import { NavigationList } from "~/components/navigation/NavigationList";
import SideNavMobile from "~/components/navigation/SideNavMobile";

export default function FlowNavigation(props: FlowNavigationProps) {
  return (
    <nav role="navigation" aria-label={props.a11yLabels?.menuLabel}>
      <SideNavMobile
        className={"fixed bottom-0 w-full md:hidden"}
        label={"Bereich"}
        currentPageTitle={"Anwaltliche Vertretung"}
      />
      <NavigationList
        {...props}
        className={
          "hidden md:block ml-32 bg-white border-[1px] border-blue-400"
        }
      />
    </nav>
  );
}
