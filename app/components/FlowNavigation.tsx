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

const StateIcon = ({ state }: { readonly state: NavState }) => {
  if (state === NavState.DoneDisabled || state === NavState.Done)
    return <CheckCircleOutlineIcon className="text-green-800" />;
  return <CircleOutlinedIcon />;
};

export default function FlowNavigation({
  navItems,
}: {
  readonly navItems: NavItem[];
}) {
  return (
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
  );
}

function NavItem({
  destination,
  label,
  state,
  subflows,
}: {
  readonly destination: string;
  readonly state: NavState;
  readonly label: string;
  readonly subflows: NavItem[];
}) {
  const relevantSubflows = subflows.filter((subflow, index) => {
    const isCurrentState = subflow.state === NavState.Current;
    const isDoneState = subflow.state === NavState.Done;
    const isReachableState = [
      NavState.Open,
      NavState.Current,
      NavState.Done,
    ].includes(subflow.state);

    const previousSubflow = subflows[index - 1];
    const previousSubflowState = previousSubflow?.state ?? NavState.Done;
    const isPreviousSubflowReachable = previousSubflowState === NavState.Done;

    return (
      isCurrentState ||
      isDoneState ||
      (isReachableState && isPreviousSubflowReachable)
    );
  });

  const collapse = useCollapse({
    defaultExpanded: state === NavState.Current,
  });

  const isDisabled = [NavState.DoneDisabled, NavState.OpenDisabled].includes(
    state,
  );

  const hasActiveSubflows =
    [NavState.Current, NavState.Open, NavState.Done].includes(state) &&
    relevantSubflows.some((subflow) =>
      [NavState.Current, NavState.Done].includes(subflow.state),
    ) &&
    relevantSubflows.length > 0;

  return (
    <li
      key={destination}
      className={"list-none border-t-2 border-white first:border-t-0"}
    >
      {hasActiveSubflows ? (
        <div
          className={`p-16 pr-0 flex gap-x-16 items-center min-w-[242px]
          ${
            state === NavState.Current
              ? "ds-label-02-bold"
              : "ds-label-02-reg hover:font-bold"
          } 
          ${
            isDisabled
              ? "text-gray-600 curser-not-allowed hover:font-normal pointer-events-none"
              : ""
          }
          ${!isDisabled && collapse.isExpanded ? "border-b-2 border-white" : ""}
        `}
          aria-disabled={[
            NavState.DoneDisabled,
            NavState.OpenDisabled,
          ].includes(state)}
        >
          <button
            className="relative flex items-center w-full cursor-pointer flex gap-x-16 items-center"
            {...collapse.getToggleProps()}
          >
            <StateIcon state={state} />
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
        getNavRootItem(destination, state, isDisabled, hasActiveSubflows, label)
      )}
      {hasActiveSubflows && (
        <section className="w-[245px]" {...collapse.getCollapseProps()}>
          <SubflowNavigation
            subflows={relevantSubflows}
            destination={destination}
          />
        </section>
      )}
    </li>
  );
}

function SubflowNavigation({
  subflows,
  destination,
}: {
  readonly subflows: NavItem[];
  readonly destination: string;
}) {
  return (
    <ul className="pt-8 pl-32 mr-8 pl-0 min-w-fit max-w-fit  md:min-w-[250px] md:max-w-[250px] break-words">
      {subflows.map(({ destination, label, state }) =>
        navSubflowItem(destination, state, label),
      )}
    </ul>
  );
}

function getNavRootItem(
  destination: string,
  state: NavState,
  isDisabled: boolean,
  hasActiveSubflows: boolean,
  label: string,
) {
  return (
    <a
      href={destination}
      className={`p-16 flex gap-x-16 items-center 
          ${
            state === NavState.Current
              ? "ds-label-02-bold"
              : "ds-label-02-reg hover:font-bold"
          } 
          ${
            isDisabled
              ? "text-gray-600 curser-not-allowed hover:font-normal pointer-events-none"
              : ""
          }
          ${hasActiveSubflows && !isDisabled ? "border-b-2 border-white" : ""}
        `}
      aria-disabled={[NavState.DoneDisabled, NavState.OpenDisabled].includes(
        state,
      )}
    >
      <StateIcon state={state} />
      {label}
    </a>
  );
}

function navSubflowItem(destination: string, state: NavState, label: string) {
  return (
    <li
      data-collapse={`collapse-${destination}`}
      key={destination}
      className="list-none"
    >
      <a
        href={destination}
        className={`p-16 flex gap-x-16 items-center 
        ${
          state === NavState.Current
            ? "ds-label-02-bold"
            : "ds-label-02-reg hover:font-bold"
        } 
        ${
          [NavState.DoneDisabled, NavState.OpenDisabled].includes(state)
            ? "text-gray-600 curser-not-allowed hover:font-normal pointer-events-none"
            : ""
        }
        `}
        aria-disabled={[NavState.DoneDisabled, NavState.OpenDisabled].includes(
          state,
        )}
      >
        <StateIcon state={state} />
        {label}
      </a>
    </li>
  );
}
