import { NavItem } from "./NavItem";
import { type NavItem as NavItemType } from "./types";

type NavigationListProps = Readonly<{
  navItems: NavItemType[];
  expandAll?: boolean;
  className?: string;
  isChild?: boolean;
  firstItemRef?: React.RefObject<HTMLAnchorElement | null>;
}>;

export const NavigationList = ({ navItems, ...props }: NavigationListProps) => (
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
