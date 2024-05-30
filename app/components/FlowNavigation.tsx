import CheckIcon from "@digitalservicebund/icons/Check";
import ExpandLessIcon from "@digitalservicebund/icons/ExpandLess";
import ExpandMoreIcon from "@digitalservicebund/icons/ExpandMore";
import classNames from "classnames";
import { useId, type FC } from "react";
import { NavState } from "../services/navigation/navState";
import { useCollapse } from "react-collapsed";

export type NavItem = {
  destination: string;
  label: string;
  state: NavState;
  subflows?: NavItem[];
  a11yLabels?: NavigationA11yLabels;
};

const StateIcon: FC<{
  id: string;
  a11yLabels?: NavigationA11yLabels;
}> = ({ id, a11yLabels }) => (
  <CheckIcon
    id={id}
    className="shrink-0"
    aria-label={a11yLabels?.itemFinished}
  />
);

const stateIsDisabled = (state: NavState) =>
  state === NavState.DoneDisabled || state === NavState.OpenDisabled;

const stateIsDone = (state: NavState) =>
  state === NavState.DoneDisabled ||
  state === NavState.Done ||
  state === NavState.DoneCurrent;

const stateIsActive = (state: NavState) =>
  [
    NavState.DoneCurrent,
    NavState.Current,
    NavState.Open,
    NavState.Done,
  ].includes(state);

type NavigationA11yLabels = {
  menuLabel: string;
  itemFinished: string;
  itemOpen: string;
};
type FlowNavigationProps = Readonly<{
  navItems: NavItem[];
  a11yLabels?: NavigationA11yLabels;
}>;

const NavigationList = ({
  navItems,
  ...props
}: FlowNavigationProps & { isChild?: boolean }) => (
  <ul className="pl-0">
    {navItems.map((navItem) => (
      <NavItem {...navItem} key={navItem.destination} {...props} />
    ))}
  </ul>
);

export default function FlowNavigation(props: FlowNavigationProps) {
  return (
    <nav aria-label={props.a11yLabels?.menuLabel}>
      <NavigationList {...props} />
    </nav>
  );
}

function isSubflowVisible(navItems: NavItem[], index: number) {
  return (
    index === 0 ||
    [NavState.Open, NavState.Current, NavState.Done].includes(
      navItems[index].state,
    )
  );
}

function NavItem({
  destination,
  label,
  state,
  subflows,
  a11yLabels,
  isChild = false,
}: Readonly<NavItem & { isChild?: boolean }>) {
  const visibleSubflows = (subflows ?? []).filter((_, index, navItems) =>
    isSubflowVisible(navItems, index),
  );

  const isDisabled = stateIsDisabled(state);
  const isCurrent =
    state === NavState.Current || state === NavState.DoneCurrent;
  const isDone = stateIsDone(state);
  const hasActiveSubflows =
    stateIsActive(state) &&
    visibleSubflows.some((subflow) => stateIsActive(subflow.state));
  const collapse = useCollapse({ defaultExpanded: isCurrent });

  const liClassNames = classNames("list-none", {
    "text-gray-600 curser-not-allowed hover:font-normal pointer-events-none":
      isDisabled,
    "border-b-[1px] border-b-white last:border-b-0": !isChild,
    "border-l-[1px] border-l-blue-800": isCurrent,
  });

  const itemClassNames = classNames(
    "w-full	ds-label-02-reg p-16 flex gap-x-16 items-center hover:underline hover:bg-blue-300 active:bg-white	focus-visible:shadow-[inset_0px_0px_0px_4px] focus:shadow-blue-800",
    {
      "ds-label-02-bold bg-blue-500 border-l-[3px] border-l-blue-800":
        isCurrent && !hasActiveSubflows,
      "pl-40": isChild,
    },
  );
  const iconId = useId();

  return (
    <li className={liClassNames}>
      {hasActiveSubflows ? (
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
            className="border-t-2 border-white"
            {...collapse.getCollapseProps()}
          >
            <NavigationList
              navItems={visibleSubflows}
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
