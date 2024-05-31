import { NavigationList, type FlowNavigationProps } from "./NavigationList";

export default function FlowNavigation(props: FlowNavigationProps) {
  return (
    <nav aria-label={props.a11yLabels?.menuLabel}>
      <NavigationList {...props} />
    </nav>
  );
}
