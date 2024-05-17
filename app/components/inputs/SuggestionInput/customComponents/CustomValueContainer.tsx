import { ValueContainerProps, components } from "react-select";
import { DataListOptions } from "../SuggestionInput";

const CustomValueContainer = (
  props: ValueContainerProps<DataListOptions, false>,
) => (
  <components.ValueContainer
    {...props}
    className="suggestion-value-container"
  />
);

export default CustomValueContainer;
