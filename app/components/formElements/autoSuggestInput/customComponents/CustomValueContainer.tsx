import classNames from "classnames";
import { components, type ValueContainerProps } from "react-select";
import type { DataListOptions } from "~/services/dataListOptions/getDataListOptions";

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
