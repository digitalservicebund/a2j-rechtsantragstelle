import classNames from "classnames";
import { ValueContainerProps, components } from "react-select";
import { DataListOptions } from "~/services/dataListOptions/getDataListOptions";

const CustomValueContainer = (
  props: ValueContainerProps<DataListOptions, false>,
) => (
  <components.ValueContainer
    {...props}
    className={classNames("suggestion-value-container", {
      "option-was-selected": props.selectProps.className?.includes(
        "option-was-selected",
      ),
    })}
  />
);

export default CustomValueContainer;
