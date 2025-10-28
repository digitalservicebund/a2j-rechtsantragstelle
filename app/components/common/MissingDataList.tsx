import type { NavItem } from "../navigation/types";
import { StandaloneLink } from "./StandaloneLink";

type Props = { navItems: NavItem[]; shouldRender?: boolean };

export const MissingDataList = ({ navItems, shouldRender }: Props) => {
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
    <ul className="ds-stack ds-stack-8">
      {navItemsWithWarnings.flatMap((navItem) => (
        <li key={navItem.destination}>
          <StandaloneLink url={navItem.destination} text={navItem.label} />
        </li>
      ))}
    </ul>
  );
};
