import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import RadioButtonCheckedOutlinedIcon from "@mui/icons-material/RadioButtonCheckedOutlined";

enum NavState {
  DoneDisabled,
  Done,
  Current,
  Open,
  OpenDisabled,
}

const navigationLinks = [
  {
    destination: ".",
    labelText: "Grundvoraussetzungen",
    state: NavState.DoneDisabled,
  },
  {
    destination: ".",
    labelText: "Das Rechtsproblem",
    state: NavState.Done,
  },
  {
    destination: ".",
    labelText: "Finanzielle Angaben",
    state: NavState.Current,
  },
  {
    destination: ".",
    labelText: "Persönliche Daten",
    state: NavState.Open,
  },
  {
    destination: ".",
    labelText: "Abgabe",
    state: NavState.OpenDisabled,
  },
];

export default function FlowNavigation() {
  return (
    <ul>
      {navigationLinks.map(({ destination, labelText, state }) => (
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
            {labelText}
          </a>
        </li>
      ))}
    </ul>
  );
}
