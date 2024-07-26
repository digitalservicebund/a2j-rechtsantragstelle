import classNames from "classnames";
import { ControlProps, components } from "react-select";
import { DataListOptions } from "~/services/dataListOptions/getDataListOptions";

const CustomControl = (props: ControlProps<DataListOptions, false>) => (
  <components.Control
    className={classNames("ds-select auto-suggest-input", {
      "has-error": props.selectProps.className?.includes("has-error"),
      "auto-suggest-input-disabled": props.selectProps.className?.includes(
        "auto-suggest-input-disabled",
      ),
    })}
    {...props}
  />
);

export default CustomControl;
