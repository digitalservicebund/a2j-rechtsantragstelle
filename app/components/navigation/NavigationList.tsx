import { NavItem } from "./NavItem";

export type NavigationA11yLabels = {
  menuLabel: string;
  itemFinished: string;
  itemOpen: string;
};

export type FlowNavigationProps = Readonly<{
  navItems: NavItem[];
  a11yLabels?: NavigationA11yLabels;
}>;

export const NavigationList = ({
  navItems,
  ...props
}: FlowNavigationProps & { isChild?: boolean }) => (
  <ul className="pl-0">
    {navItems.map((navItem) => (
      <NavItem {...navItem} key={navItem.destination} {...props} />
    ))}
  </ul>
);
