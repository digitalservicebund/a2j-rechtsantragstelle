import CheckIcon from "@digitalservicebund/icons/Check";
import ExpandLessIcon from "@digitalservicebund/icons/ExpandLess";
import ExpandMoreIcon from "@digitalservicebund/icons/ExpandMore";
import classNames from "classnames";
import { useId } from "react";
import { useCollapse } from "react-collapsed";
import {
  stateIsCurrent,
  stateIsActive,
  stateIsDisabled,
  stateIsDone,
  type NavState,
} from "~/services/navigation/navState";

export type NavItem = {
  destination: string;
  label: string;
  state: NavState;
  subflows?: NavItem[];
  a11yLabels?: NavigationA11yLabels;
};

export type FlowNavigationProps = Readonly<{
  navItems: NavItem[];
  a11yLabels?: NavigationA11yLabels;
}>;

type NavigationA11yLabels = {
  menuLabel: string;
  itemFinished: string;
  itemOpen: string;
};

export function NavItem({
  destination,
  label,
  state,
  subflows = [],
  a11yLabels,
  isChild = false,
}: Readonly<NavItem & { isChild?: boolean }>) {
  const visibleChildItems = subflows.filter((subItem) =>
    stateIsActive(subItem.state),
  );
  const hasSubflows = visibleChildItems.length > 0;
  const isDisabled = stateIsDisabled(state);
  const isCurrent = stateIsCurrent(state);
  const isDone = stateIsDone(state);
  const collapse = useCollapse({ defaultExpanded: isCurrent });

  // Transparent left borders to avoid layout shifts
  const liClassNames = classNames("list-none border-l-[1px] min-w-full", {
    "text-gray-600 curser-not-allowed hover:font-normal pointer-events-none":
      isDisabled,
    "mb-1": !isChild, // margin instead of bottom border to avoid diagonal corners colors
    "border-l-blue-800": isCurrent,
    "border-l-blue-100": !isCurrent,
  });

  const itemClassNames = classNames(
    "bg-blue-100 w-full ds-label-02-reg p-16 border-l-[3px] border-transparent flex gap-x-4 items-center hover:underline hover:bg-blue-300 active:bg-white focus-visible:shadow-[inset_0px_0px_0px_4px] focus:shadow-blue-800",
    {
      "ds-label-02-bold bg-blue-500 border-l-blue-800":
        isCurrent && !hasSubflows,
      "pl-40": isChild,
    },
  );
  const iconId = useId();

  return (
    <li className={liClassNames}>
      {hasSubflows ? (
        <>
          <button
            className={itemClassNames}
            aria-disabled={isDisabled}
            aria-expanded={collapse.isExpanded}
            {...collapse.getToggleProps()}
            aria-describedby={iconId}
          >
            {isDone && <StateIcon id={iconId} a11yLabels={a11yLabels} />}
            {label}
            {collapse.isExpanded ? (
              <ExpandLessIcon className="ml-auto" />
            ) : (
              <ExpandMoreIcon className="ml-auto" />
            )}
          </button>
          <section
            className="border-t-[1px] border-white"
            {...collapse.getCollapseProps()}
          >
            <NavigationList
              navItems={visibleChildItems}
              a11yLabels={a11yLabels}
              isChild={true}
            />
          </section>
        </>
      ) : (
        <a
          href={destination}
          className={itemClassNames}
          aria-disabled={isDisabled}
          aria-current={isCurrent}
          aria-describedby={iconId}
        >
          {isDone && <StateIcon id={iconId} a11yLabels={a11yLabels} />}
          {label}
        </a>
      )}
    </li>
  );
}

export const NavigationList = ({
  navItems,
  ...props
}: FlowNavigationProps & { isChild?: boolean }) => (
  <ul className="pl-0">
    {navItems.map((navItem) => (
      <NavItem {...navItem} key={navItem.destination} {...props} />
    ))}
  </ul>
);

function StateIcon({
  id,
  a11yLabels,
}: {
  id: string;
  a11yLabels?: NavigationA11yLabels;
}) {
  return (
    <CheckIcon
      id={id}
      className="shrink-0"
      aria-label={a11yLabels?.itemFinished}
    />
  );
}
