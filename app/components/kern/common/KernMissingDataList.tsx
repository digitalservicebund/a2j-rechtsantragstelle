import type { NavItem } from "../navigation/types";

type KernMissingDataListProps = { navItems: NavItem[]; shouldRender?: boolean };

export const KernMissingDataList = ({
  navItems,
  shouldRender,
}: KernMissingDataListProps) => {
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
