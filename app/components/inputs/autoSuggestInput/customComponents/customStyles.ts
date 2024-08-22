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

const customStyles = (
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
    control: (base, { menuIsOpen }) => ({
      ...base,
      borderRadius: "",
      backgroundImage: "none",
      borderColor: "",
      outline: menuIsOpen ? "solid 4px #004b76" : "none",
      outlineOffset: menuIsOpen ? "-4px" : "",
      paddingRight: "1rem",
      paddingLeft: "0.5rem",
      borderStyle: "",
      boxShadow: "",
      backgroundColor: menuIsOpen ? "#F2F6F8" : "",
      ...hoverActiveStyle,
    }),
    option: (base, { isFocused, isSelected }) => {
      return {
        ...base,
        backgroundColor: getOptionBackgroundColor(isFocused, isSelected),
        borderLeft: isFocused ? "4px solid #004B76" : "",
        color: "inherit",
      };
    },
    clearIndicator: (base) => ({
      ...base,
      color: "",
      ":hover": {
        color: "",
      },
    }),
  };
};

export default customStyles;
