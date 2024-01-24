import CheckCircleOutlineIcon from "@digitalservicebund/icons/CheckCircleOutline";
import CircleOutlinedIcon from "@digitalservicebund/icons/CircleOutlined";
import { NavState } from "~/services/flowNavigation";

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
      {navItems.map(({ destination, label, state, subflows }) =>
        navItem(destination, state, label, subflows),
      )}
    </ul>
  );
}

function navItem(
  destination: string,
  state: NavState,
  label: string,
  subflows = [] as NavItem[],
) {
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

  return (
    <li
      key={destination}
      className={"list-none border-t-2 border-white first:border-t-0"}
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
        ${relevantSubflows.length > 0 ? "border-b-2 border-white" : ""}
      `}
        aria-disabled={[NavState.DoneDisabled, NavState.OpenDisabled].includes(
          state,
        )}
      >
        <StateIcon state={state} />
        {label}
      </a>
      {[NavState.Current, NavState.Open, NavState.Done].includes(state) &&
        relevantSubflows.some((subflow) =>
          [NavState.Current, NavState.Done].includes(subflow.state),
        ) &&
        relevantSubflows.length > 0 && (
          <ul className="pt-8 pl-32 mr-8 pl-0 min-w-fit max-w-fit  md:min-w-[250px] md:max-w-[250px] break-words">
            {relevantSubflows.map(({ destination, label, state }) =>
              navSubflowItem(destination, state, label),
            )}
          </ul>
        )}
    </li>
  );
}

function navSubflowItem(destination: string, state: NavState, label: string) {
  return (
    <li key={destination} className="list-none">
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
