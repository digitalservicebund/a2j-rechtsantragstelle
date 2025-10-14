import { NavItem } from "./NavItem";
import { type FlowNavigationProps } from "./types";

export const NavigationList = ({
  navItems,
  ...props
}: FlowNavigationProps & {
  isChild?: boolean;
  firstItemRef?: React.RefObject<HTMLAnchorElement | null>;
}) => (
  <ul className={`pl-0 bg-white ${props.className ?? ""}`}>
    {navItems.map((navItem, index) => (
      <NavItem
        key={navItem.destination}
        {...navItem}
        forceExpanded={props.expandAll}
        {...props}
        firstItemRef={index === 0 ? props.firstItemRef : undefined}
      />
    ))}
  </ul>
);
