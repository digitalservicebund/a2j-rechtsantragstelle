import { NavigationList } from "./NavigationList";
import { type NavItem } from "./types";

type Props = Pick<NavItem, "a11yLabels"> & {
  navItems: NavItem[];
};

export const NavigationListSubflows = ({ navItems, a11yLabels }: Props) => {
  return (
    <NavigationList
      navItems={navItems}
      a11yLabels={a11yLabels}
      isChild={true}
    />
  );
};
