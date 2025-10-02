import { NavItem } from "./NavItem";
import { type FlowNavigationProps } from "./types";

export const NavigationList = ({
  navItems,
  ...props
}: FlowNavigationProps & {
  isChild?: boolean;
  itemRefs?: {
    firstItemRef?: React.RefObject<HTMLAnchorElement | null>;
    lastItemRef?: React.RefObject<HTMLAnchorElement | null>;
  };
}) => (
  <ul className={`pl-0 bg-white ${props.className ?? ""}`}>
    {navItems.map((navItem, index) => (
      <NavItem
        key={navItem.destination}
        {...navItem}
        forceExpanded={props.expandAll}
        {...props}
        itemRefs={{
          firstItemRef: index === 0 ? props.itemRefs?.firstItemRef : undefined,
          lastItemRef:
            index === navItems.length - 1
              ? props.itemRefs?.lastItemRef
              : undefined,
        }}
      />
    ))}
  </ul>
);
