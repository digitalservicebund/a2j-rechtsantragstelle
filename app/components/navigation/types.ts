import { type NavState } from "~/services/navigation/navState";

export type NavigationA11yLabels = {
  menuLabel: string;
  itemFinished: string;
  itemOpen: string;
};

export type FlowNavigationProps = Readonly<{
  navItems: NavItem[];
  expandAll?: boolean;
  a11yLabels?: NavigationA11yLabels;
  className?: string;
  mobileLabels?: MobileNavigationLabels;
}>;

export type NavItem = {
  destination: string;
  label: string;
  state: NavState;
  expanded?: boolean;
  subflows?: NavItem[];
  a11yLabels?: NavigationA11yLabels;
};

export type MobileNavigationLabels = {
  currentArea: string;
  closeMenu: string;
  toggleMenu: string;
};
