import { type NavState } from "~/services/navigation/navState";

export type FlowNavigationProps = Readonly<{
  navItems: NavItem[];
  expandAll?: boolean;
  className?: string;
}>;

export type NavItem = {
  destination: string;
  label: string;
  state: NavState;
  forceExpanded?: boolean;
  subflows?: NavItem[];
};
