import CheckCircleOutlineIcon from "@digitalservicebund/icons/CheckCircleOutline";
import CircleOutlinedIcon from "@digitalservicebund/icons/CircleOutlined";
import RadioButtonCheckedOutlinedIcon from "@digitalservicebund/icons/RadioButtonCheckedOutlined";
import { NavState } from "~/services/flowNavigation";

export type NavItem = {
  destination: string;
  label: string;
  state: NavState;
};

export default function FlowNavigation({
  navItems,
}: {
  readonly navItems: NavItem[];
}) {
  return (
    <ul>
      {navItems.map(({ destination, label, state }) => (
        <li
          key={destination}
          className="p-16 list-none border-b-2 border-white"
        >
          <a
            href={destination}
            className={`flex gap-x-16 items-center ${
              state === NavState.Current
                ? "ds-label-02-bold"
                : "ds-label-02-reg hover:font-bold"
            } ${
              [NavState.DoneDisabled, NavState.OpenDisabled].includes(state)
                ? "text-gray-600 curser-not-allowed hover:font-normal pointer-events-none"
                : ""
            }`}
            aria-disabled={[
              NavState.DoneDisabled,
              NavState.OpenDisabled,
            ].includes(state)}
          >
            {state === NavState.Current ? (
              <RadioButtonCheckedOutlinedIcon />
            ) : [NavState.DoneDisabled, NavState.Done].includes(state) ? (
              <CheckCircleOutlineIcon className="text-green-800" />
            ) : (
              <CircleOutlinedIcon />
            )}
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}
