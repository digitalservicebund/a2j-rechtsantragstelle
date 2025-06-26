import { NavItem } from "./NavItem";
import { type FlowNavigationProps } from "./types";

export const NavigationList = ({
  navItems,
  ...props
}: FlowNavigationProps & { isChild?: boolean }) => (
  <ul className={`pl-0 bg-white ${props.className ?? ""}`}>
    {navItems.map((navItem) => (
      <NavItem
        {...navItem}
        key={navItem.destination}
        forceExpanded={props.expandAll}
        {...props}
      />
    ))}
  </ul>
);
