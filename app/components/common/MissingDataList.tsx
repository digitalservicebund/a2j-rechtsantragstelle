import type { NavItem } from "../navigation/types";

type Props = { navItems: NavItem[]; shouldRender?: boolean };

export const MissingDataList = ({ navItems, shouldRender }: Props) => {
  if (!shouldRender) return null;
  const navItemsWithWarnings = navItems
    .filter(
      (navItem) =>
        navItem.state === "Warning" ||
        navItem.subflows?.some((subflow) => subflow.state === "Warning"),
    )
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
    <ul className="ds-stack ds-stack-8">
      {navItemsWithWarnings.flatMap((navItem) => (
        <li key={navItem.destination}>
          <a className="text-link" href={navItem.destination}>
            {navItem.label}
          </a>
        </li>
      ))}
    </ul>
  );
};
