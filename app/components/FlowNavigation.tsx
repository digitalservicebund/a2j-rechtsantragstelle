import CheckCircleOutlineIcon from "@digitalservicebund/icons/CheckCircleOutline";
import CircleOutlinedIcon from "@digitalservicebund/icons/CircleOutlined";
import ExpandLessIcon from "@digitalservicebund/icons/ExpandLess";
import ExpandMoreIcon from "@digitalservicebund/icons/ExpandMore";

import { useCollapse } from "react-collapsed";

export enum NavState {
  DoneDisabled,
  Done,
  Current,
  Open,
  OpenDisabled,
}

export type NavItem = {
  destination: string;
  label: string;
  state: NavState;
  subflows?: NavItem[];
};

const StateIcon = ({ isDone }: { readonly isDone: boolean }) => {
  if (isDone)
    return <CheckCircleOutlineIcon className="shrink-0 text-green-800" />;
  return <CircleOutlinedIcon className="shrink-0" />;
};

const stateIsDisabled = (state: NavState) =>
  state === NavState.DoneDisabled || state === NavState.OpenDisabled;

const stateIsDone = (state: NavState) =>
  state === NavState.DoneDisabled || state === NavState.Done;

const stateIsActive = (state: NavState) =>
  [NavState.Current, NavState.Open, NavState.Done].includes(state);

const navItemClassnames = (
  isCurrent: boolean,
  isDisabled: boolean,
  isExpanded = false,
) =>
  "p-16 flex gap-x-16 items-center " +
  (isCurrent ? "ds-label-02-bold " : "ds-label-02-reg hover:underline ") +
  (isDisabled
    ? "text-gray-600 curser-not-allowed hover:font-normal pointer-events-none "
    : " ") +
  (!isDisabled && isExpanded ? "border-b-2 border-white" : "");

export default function FlowNavigation({
  navItems,
}: {
  readonly navItems: NavItem[];
}) {
  return (
    <nav aria-label="Formularnavigation">
      <ul>
        {navItems.map(({ destination, label, state, subflows }) => (
          <NavItem
            key={destination}
            destination={destination}
            state={state}
            label={label}
            subflows={subflows ?? []}
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

function NavItem({ destination, label, state, subflows }: Readonly<NavItem>) {
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
  const stateClassNames = navItemClassnames(
    isCurrent,
    isDisabled,
    collapse.isExpanded,
  );

  return (
    <li
      key={destination}
      className={"list-none border-t-2 border-white first:border-t-0"}
    >
      {hasActiveSubflows ? (
        <div
          className={`md:pr-0 min-w-[242px] ${stateClassNames}`}
          aria-disabled={isDisabled}
        >
          <button
            className="relative flex items-center w-full cursor-pointer flex gap-x-16 items-center"
            {...collapse.getToggleProps()}
          >
            <StateIcon isDone={isDone} />
            {label}
            <i className="absolute right-0 pt-1 text-base transition-transform fa fa-chevron-down group-open:rotate-180"></i>
            {collapse.isExpanded ? (
              <ExpandLessIcon className="ml-auto" />
            ) : (
              <ExpandMoreIcon className="ml-auto" />
            )}
          </button>
        </div>
      ) : (
        <a
          href={destination}
          className={stateClassNames}
          aria-disabled={isDisabled}
          aria-current={isCurrent}
        >
          <StateIcon isDone={isDone} />
          {label}
        </a>
      )}
      {hasActiveSubflows && (
        <section className="w-[240px]" {...collapse.getCollapseProps()}>
          <SubflowNavigation subflows={visibleSubflows} />
        </section>
      )}
    </li>
  );
}

function SubflowNavigation({ subflows }: { readonly subflows: NavItem[] }) {
  return (
    <ul className="pt-8 pl-32 mr-8 pl-0 min-w-fit max-w-fit  md:min-w-[250px] md:max-w-[250px] break-words">
      {subflows.map(({ destination, label, state }) =>
        navSubflowItem(destination, state, label),
      )}
    </ul>
  );
}

function navSubflowItem(destination: string, state: NavState, label: string) {
  const isDisabled = stateIsDisabled(state);
  const isCurrent = state === NavState.Current;
  return (
    <li
      data-collapse={`collapse-${destination}`}
      key={destination}
      className="list-none"
    >
      <a
        href={destination}
        className={navItemClassnames(isCurrent, isDisabled)}
        aria-disabled={isDisabled}
        aria-current={isCurrent}
      >
        <StateIcon isDone={stateIsDone(state)} />
        {label}
      </a>
    </li>
  );
}
