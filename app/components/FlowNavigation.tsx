import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import RadioButtonCheckedOutlinedIcon from "@mui/icons-material/RadioButtonCheckedOutlined";

const navigationLinks = [
  {
    destination: ".",
    labelText: "Grundvoraussetzungen",
    isDisabled: true,
    isDone: true,
    isCurrent: false,
  },
  {
    destination: ".",
    labelText: "Das Rechtsproblem",
    isDisabled: false,
    isDone: true,
    isCurrent: false,
  },
  {
    destination: ".",
    labelText: "Finanzielle Angaben",
    isDisabled: false,
    isDone: false,
    isCurrent: true,
  },
  {
    destination: ".",
    labelText: "Persönliche Daten",
    isDisabled: false,
    isDone: false,
    isCurrent: false,
  },
  {
    destination: ".",
    labelText: "Abgabe",
    isDisabled: true,
    isDone: false,
    isCurrent: false,
  },
];

export default function FlowNavigation() {
  return (
    <ul>
      {navigationLinks.map(
        ({ destination, labelText, isDisabled, isCurrent, isDone }) => (
          <li
            key={destination}
            className="p-16 list-none border-b-2 border-white"
            style={{ width: "256px" }}
          >
            <a
              href={destination}
              className={`flex gap-x-16 items-center
              ${isCurrent ? "ds-label-02-bold" : "ds-label-02-reg"} ${
                isDisabled ? "text-gray-600" : ""
              } `}
            >
              {isDone ? (
                <CheckCircleOutlineIcon />
              ) : isCurrent ? (
                <RadioButtonCheckedOutlinedIcon />
              ) : (
                <CircleOutlinedIcon />
              )}
              {labelText}
            </a>
          </li>
        ),
      )}
    </ul>
  );
}
