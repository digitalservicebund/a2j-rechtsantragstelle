import { type NavState } from "~/services/navigation/navState";

export type FlowNavigationProps = Readonly<{
  navItems: NavItem[];
  className?: string;
  mobileLabels?: MobileNavigationLabels;
}>;

export type NavItem = {
  destination: string;
  label: string;
  state: NavState;
  subflows?: NavItem[];
};

export type MobileNavigationLabels = {
  currentArea: string;
  closeMenu: string;
  toggleMenu: string;
};
