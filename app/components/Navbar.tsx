import React from "react";
import { useLocation, useMatches } from "@remix-run/react";
import { z } from "zod";

export const NavbarPropsSchema = z.object({
  tree: z.array(
    z.object({
      text: z.string(),
      targeturl: z.string().optional(),
      baseurl: z.string().optional(),
    })
  ),
  currentLocation: z.string().optional(),
});

export type NavbarProps = z.infer<typeof NavbarPropsSchema>;

export default function Navbar({ tree = [], currentLocation }: NavbarProps) {
  const location = useLocation();
  const matches = useMatches();

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
    <header className="mb-20 mt-20 ml-16">
      {tree &&
        treeFilter.map((item, index) => (
          <React.Fragment key={item.text}>
            {item.targeturl ? (
              <a
                href={item.targeturl}
                className={
                  navigationItemStyle +
                  (index === 0 ? " ds-label-01-bold " : "")
                }
              >
                {item.text}
              </a>
            ) : (
              <span className="ds-label-01-bold mr-8">{item.text}</span>
            )}
            {index < treeFilter.length - 1 && <span className="mr-8">|</span>}
          </React.Fragment>
        ))}
    </header>
  );
}
