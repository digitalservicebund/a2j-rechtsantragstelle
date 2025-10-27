import type { NavItem } from "../navigation/types";

export const MissingDataList = (props: { navItems: NavItem[] }) => {
  const navItemsWithWarnings = props.navItems
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
