import type { StylesConfig } from "react-select";
import type { DataListOptions } from "~/services/dataListOptions/getDataListOptions";

const getOptionBackgroundColor = (
  isFocused: boolean,
  isSelected: boolean,
): string | undefined => {
  if (isFocused) {
    return "#ECF1F4";
  }

  if (isSelected) {
    return "#DCE8EF";
  }

  return undefined;
};

const kernCustomStyles = (
  hasError: boolean,
): StylesConfig<DataListOptions, false> => {
  const hoverActiveStyle = !hasError && {
    "&:hover": {
      backgroundColor: "#F2F6F8",
    },
    "&:focus": {
      backgroundColor: "#F2F6F8",
    },
  };

  return {
    menuPortal: (base) => ({
      ...base,
      zIndex: 999,
    }),
    control: (base, { menuIsOpen }) => ({
      ...base,
      backgroundColor: "transparent",
      border: "none",
      boxShadow: "",
      outline: "none",
      ...hoverActiveStyle,
    }),
    option: (base, { isFocused, isSelected }) => {
      return {
        ...base,
        backgroundColor: getOptionBackgroundColor(isFocused, isSelected),
        borderLeft: isFocused ? "4px solid var(--kern-action-default)" : "none",
      };
    },
    clearIndicator: (base) => ({
      ...base,
      transition: "none",
    }),
    valueContainer: (base) => ({
      ...base,
      height: "100%",
    }),
    input: (base) => ({
      ...base,
      height: "100%",
      gridTemplateColumns: "auto",
      input: {
        gridColumn: "1/3 !important",
      },
    }),
  };
};

export default kernCustomStyles;
