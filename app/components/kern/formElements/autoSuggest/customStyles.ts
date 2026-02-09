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
    control: ({ isFocused }) => {
      // The control component will have the kern-form-input__input class applied
      // via the classNames prop. We don't spread base to avoid React Select's
      // default visual styles. Only include minimal layout properties needed
      // for functionality, letting KERN CSS handle all visual styling.
      // Apply KERN focus outline when focused (4px solid border with -4px offset)
      return {
        // Only essential layout properties - no visual styling
        minHeight: "48px",
        height: "100%",
        display: "flex",
        alignItems: "center",
        cursor: "text",
        // Apply KERN focus outline when focused using KERN color variable
        outline: isFocused
          ? "4px solid var(--kern-color-action-default)"
          : "none",
        outlineOffset: isFocused ? "-4px" : "0",
        // Don't set any border, background, or other visual properties
        // KERN CSS (.kern-form-input__input) will provide all other visual styling
      };
    },
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
