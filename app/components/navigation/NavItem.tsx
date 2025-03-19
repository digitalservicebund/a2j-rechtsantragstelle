import CheckCircle from "@digitalservicebund/icons/CheckCircle";
import ExpandLessIcon from "@digitalservicebund/icons/ExpandLess";
import ExpandMoreIcon from "@digitalservicebund/icons/ExpandMore";
import classNames from "classnames";
import { useId, type FC } from "react";
import { useCollapse } from "react-collapsed";
import {
  stateIsCurrent,
  stateIsActive,
  stateIsDisabled,
  stateIsDone,
  type NavState,
} from "~/services/navigation/navState";
import { NavigationList, type NavigationA11yLabels } from "./NavigationList";

export type NavItem = {
  destination: string;
  label: string;
  state: NavState;
  subflows?: NavItem[];
  a11yLabels?: NavigationA11yLabels;
};

export const StateIcon: FC<{
  id: string;
  a11yLabels?: NavigationA11yLabels;
}> = ({ id, a11yLabels }) => (
  <CheckCircle
    id={id}
    className="shrink-0 fill-green-700"
    aria-label={a11yLabels?.itemFinished}
  />
);

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

  // Transparent last: borders to avoid layout shifts
  const liClassNames = classNames(
    "list-none border-b-[1px] border-blue-400 last:border-0 min-w-full",
    {
      "text-gray-600 curser-not-allowed hover:font-normal pointer-events-none":
        isDisabled,
      "border-transparent last:border-transparent": isChild,
    },
  );

  const itemClassNames = classNames(
    "w-full ds-label-02-reg p-16 flex justify-between items-center hover:underline hover:bg-blue-400 active:bg-blue-300 focus-visible:shadow-[inset_0px_0px_0px_4px] focus:shadow-blue-300",
    {
      "ds-label-02-bold bg-blue-400": isCurrent && !hasSubflows,
      "pl-24": isChild,
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
            aria-describedby={isDone ? iconId : undefined}
            role={undefined} // due the rest operator, the role is assigned to the button in the server side rendering
          >
            {label}
            {collapse.isExpanded ? (
              <ExpandLessIcon className="ml-auto" />
            ) : (
              <ExpandMoreIcon className="ml-auto" />
            )}
            {isDone && <StateIcon id={iconId} a11yLabels={a11yLabels} />}
          </button>
          {
            // due the rest operator, the role is assigned to the section in the server side rendering
          }
          <section {...collapse.getCollapseProps()} role={undefined}>
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
          aria-describedby={isDone ? iconId : undefined}
        >
          {label}
          {isDone && <StateIcon id={iconId} a11yLabels={a11yLabels} />}
        </a>
      )}
    </li>
  );
}
