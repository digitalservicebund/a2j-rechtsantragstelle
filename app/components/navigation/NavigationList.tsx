import { NavItem } from "./NavItem";
import { type FlowNavigationProps } from "./types";

export const NavigationList = ({
  navItems,
  ...props
}: FlowNavigationProps & { isChild?: boolean }) => (
  <ul className={`pl-0 bg-white ${props.className ?? ""}`}>
    {navItems.map((navItem) => (
      <NavItem
        key={navItem.destination}
        {...navItem}
        forceExpanded={props.expandAll}
        {...props}
      />
    ))}
  </ul>
);
