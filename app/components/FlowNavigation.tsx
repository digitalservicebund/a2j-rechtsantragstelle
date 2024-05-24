import CheckCircleOutlineIcon from "@digitalservicebund/icons/CheckCircleOutline";
import CircleOutlinedIcon from "@digitalservicebund/icons/CircleOutlined";
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
  isDone: boolean;
  id: string;
  a11yLabels?: NavigationA11yLabels;
}> = ({ isDone, id, a11yLabels }) => {
  const Icon = isDone ? CheckCircleOutlineIcon : CircleOutlinedIcon;
  const classNames = isDone ? "text-green-800" : "";
  const label = isDone ? a11yLabels?.itemFinished : a11yLabels?.itemOpen;
  return (
    <Icon id={id} className={`shrink-0 ${classNames}`} aria-label={label} />
  );
};

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

export default function FlowNavigation({
  navItems,
  a11yLabels,
}: Readonly<{
  navItems: NavItem[];
  a11yLabels?: NavigationA11yLabels;
}>) {
  return (
    <nav aria-label={a11yLabels?.menuLabel}>
      <ul>
        {navItems.map((navItem) => (
          <NavItem
            {...navItem}
            key={navItem.destination}
            a11yLabels={a11yLabels}
          />
        ))}
      </ul>
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
            <StateIcon isDone={isDone} id={iconId} a11yLabels={a11yLabels} />
            {label}
            {collapse.isExpanded ? (
              <ExpandLessIcon className="ml-auto" />
            ) : (
              <ExpandMoreIcon className="ml-auto" />
            )}
          </button>
          <section
            className="w-[240px] border-t-2 border-white"
            {...collapse.getCollapseProps()}
          >
            <SubflowNavigation
              subflows={visibleSubflows}
              a11yLabels={a11yLabels}
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
          <StateIcon isDone={isDone} id={iconId} a11yLabels={a11yLabels} />
          {label}
        </a>
      )}
    </li>
  );
}

function SubflowNavigation({
  subflows,
  a11yLabels,
}: Readonly<{ subflows: NavItem[]; a11yLabels?: NavigationA11yLabels }>) {
  return (
    <ul className="pt-8 pl-32 mr-8 pl-0 min-w-fit max-w-fit  md:min-w-[250px] md:max-w-[250px] break-words">
      {subflows.map(({ destination, label, state }) => (
        <NavItem
          key={destination}
          destination={destination}
          state={state}
          label={label}
          a11yLabels={a11yLabels}
          isChild={true}
        />
      ))}
    </ul>
  );
}
