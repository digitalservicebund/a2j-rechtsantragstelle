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
  state === NavState.DoneDisabled || state === NavState.Done;

const stateIsActive = (state: NavState) =>
  [NavState.Current, NavState.Open, NavState.Done].includes(state);

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
  a11yLabels,
  isChild = false,
}: FlowNavigationProps & { isChild?: boolean }) => (
  <ul
    className={
      isChild
        ? "pl-32 mr-8 min-w-fit max-w-fit md:min-w-[250px] md:max-w-[250px] break-words"
        : ""
    }
  >
    {navItems.map((navItem) => (
      <NavItem
        {...navItem}
        key={navItem.destination}
        a11yLabels={a11yLabels}
        isChild={isChild}
      />
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
  const isCurrent = state === NavState.Current;
  const isDone = stateIsDone(state);
  const hasActiveSubflows =
    stateIsActive(state) &&
    visibleSubflows.some((subflow) => stateIsActive(subflow.state));
  const collapse = useCollapse({ defaultExpanded: isCurrent });
  const stateClassNames = classNames(
    "p-16 flex gap-x-16 items-center ds-label-02-reg hover:underline",
    {
      "ds-label-02-bold hover:no-underline": isCurrent,
      "text-gray-600 curser-not-allowed hover:font-normal pointer-events-none":
        isDisabled,
    },
  );
  const iconId = useId();

  return (
    <li
      className={`list-none ${isChild ? "" : "border-t-2 border-white first:border-t-0"}`}
    >
      {hasActiveSubflows ? (
        <>
          <button
            className={`${stateClassNames} md:pr-0 min-w-[242px] relative flex items-center w-full cursor-pointer flex gap-x-16 items-center`}
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
          className={stateClassNames}
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
