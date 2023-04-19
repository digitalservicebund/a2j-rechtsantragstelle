import React from "react";
import type { NavigationItemProps } from "./NavigationItem";
import NavigationItem from "./NavigationItem";
import { useLocation, useMatches } from "@remix-run/react";

export interface NavbarProps extends React.ClassAttributes<HTMLHeadingElement> {
  tree: NavigationItemProps[];
  currentLocation?: string;
}

export default function Navbar({ tree, currentLocation }: NavbarProps) {
  const location = useLocation();
  const matches = useMatches();

  console.log(tree);

  const treeFilter = tree.filter(
    (item) =>
      !item.baseurl ||
      location.pathname.includes(item.baseurl) ||
      (currentLocation &&
        !matches.map((m) => m.pathname.includes(currentLocation)))
  );

  const navigationItemStyle =
    "no-underline hover:underline mr-8 text-black focus:outline active:underline active:decoration-4";

  return (
    <div className="mb-20 mt-20 ml-16">
      {tree &&
        treeFilter.map((item, index) => (
          <React.Fragment key={index}>
            <NavigationItem
              {...item}
              {...{
                className:
                  index === 0
                    ? "ds-label-01-bold " + navigationItemStyle
                    : navigationItemStyle,
              }}
            />
            {index < treeFilter.length - 1 && <span className="mr-8">|</span>}
          </React.Fragment>
        ))}
    </div>
  );
}
