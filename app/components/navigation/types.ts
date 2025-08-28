import { type NavState } from "~/services/navigation/navState";

export type FlowNavigationProps = Readonly<{
  navItems: NavItem[];
  expandAll?: boolean;
  className?: string;
  userVisitedValidationPage?: boolean;
}>;

export type NavItem = {
  destination: string;
  label: string;
  state: NavState;
  forceExpanded?: boolean;
  userVisitedValidationPage?: boolean;
  subflows?: NavItem[];
};
