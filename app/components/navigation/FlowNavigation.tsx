import { NavigationList, type FlowNavigationProps } from "./NavItem";

export default function FlowNavigation(props: FlowNavigationProps) {
  return (
    <nav aria-label={props.a11yLabels?.menuLabel} className="bg-white">
      <NavigationList {...props} />
    </nav>
  );
}
