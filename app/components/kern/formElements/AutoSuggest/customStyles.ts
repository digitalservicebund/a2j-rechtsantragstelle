import type { StylesConfig } from "react-select";
import type { DataListOptions } from "~/services/dataListOptions/getDataListOptions";

const getOptionBackgroundColor = (
  isFocused: boolean,
  isSelected: boolean,
): string | undefined => {
  if (isFocused) {
    return "#EFF0F4";
  }

  if (isSelected) {
    return "#DFE1EA";
  }

  return undefined;
};

const kernCustomStyles = (): StylesConfig<DataListOptions, false> => {
  return {
    menuPortal: (base) => ({
      ...base,
      zIndex: 999,
    }),
    control: (base, { menuIsOpen, isFocused }) => ({
      ...base,
      minHeight: "100%",
      height: "100%",
      padding: "0",
      border: "none",
      borderRadius: 0,
      boxShadow: "none",
      backgroundColor: "transparent",
      display: "flex",
      alignItems: "center",
      outline: menuIsOpen || isFocused ? "solid 4px #1A3DA5" : "none",
      outlineOffset: menuIsOpen || isFocused ? "-4px" : "0",
      "&:hover": {
        border: "none",
      },
    }),
    option: (base, { isFocused, isSelected }) => {
      return {
        ...base,
        backgroundColor: getOptionBackgroundColor(isFocused, isSelected),
        borderLeft: isFocused ? "4px solid #1A3DA5" : "",
        color: "inherit",
      };
    },
    clearIndicator: (base) => ({
      ...base,
      padding: 0,
    }),
    valueContainer: (base) => ({
      ...base,
      padding: 0,
      height: "100%",
      display: "flex",
      alignItems: "center",
    }),
    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
      border: "none",
      boxShadow: "none",
      outline: "none",
      height: "100%",
      gridTemplateColumns: "auto",
      input: {
        gridColumn: "1/3 !important",
      },
    }),
  };
};

export default kernCustomStyles;
