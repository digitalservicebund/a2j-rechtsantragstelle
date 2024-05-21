import { ValueContainerProps, components } from "react-select";
import { DataListOptions } from "../SuggestionInput";
import classNames from "classnames";

const CustomValueContainer = (
  props: ValueContainerProps<DataListOptions, false>,
  optionWasSelected: boolean,
) => (
  <components.ValueContainer
    {...props}
    className={classNames("suggestion-value-container", {
      "option-was-selected": optionWasSelected,
    })}
  />
);

export default CustomValueContainer;
