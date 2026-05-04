import type { NavItem } from "../kern/navigation/types";

type MissingDataListProps = { navItems: NavItem[]; shouldRender?: boolean };

export const MissingDataList = ({
  navItems,
  shouldRender,
}: MissingDataListProps) => {
  if (!shouldRender) return null;
  const navItemsWithWarnings = navItems
    .filter((navItem) => navItem.state === "Warning")
    .flatMap((navItem) =>
      navItem.subflows
        ? navItem.subflows
            .filter((subNavItem) => subNavItem.state === "Warning")
            .map((subNavItem) => ({
              ...subNavItem,
              label: `${navItem.label}: ${subNavItem.label}`,
            }))
        : navItem,
    );
  return (
    <ul>
      {navItemsWithWarnings.flatMap((navItem) => (
        <li key={navItem.destination}>
          <a href={navItem.destination} className="kern-link">
            {navItem.label}
          </a>
        </li>
      ))}
    </ul>
  );
};
