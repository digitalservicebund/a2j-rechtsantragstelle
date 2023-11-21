import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import RadioButtonCheckedOutlinedIcon from "@mui/icons-material/RadioButtonCheckedOutlined";

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
};

export default function FlowNavigation({ navItems }: { navItems: NavItem[] }) {
  return (
    <ul>
      {navItems.map(({ destination, label, state }) => (
        <li
          key={destination}
          className="p-16 list-none border-b-2 border-white"
          style={{ width: "256px" }}
        >
          <a
            href={destination}
            className={`flex gap-x-16 items-center ${
              state === NavState.Current
                ? "ds-label-02-bold"
                : "ds-label-02-reg"
            } ${
              [NavState.DoneDisabled, NavState.OpenDisabled].includes(state)
                ? "text-gray-600"
                : ""
            }`}
          >
            {state === NavState.Current ? (
              <RadioButtonCheckedOutlinedIcon />
            ) : [NavState.DoneDisabled, NavState.Done].includes(state) ? (
              <CheckCircleOutlineIcon />
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
