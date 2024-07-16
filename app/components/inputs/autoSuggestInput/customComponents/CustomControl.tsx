import classNames from "classnames";
import { ControlProps, components } from "react-select";
import { DataListOptions } from "~/services/dataListOptions/getDataListOptions";

const CustomControl = (
  props: ControlProps<DataListOptions, false>,
  error?: string,
) => (
  <components.Control
    className={classNames("ds-select auto-suggest-input", {
      "has-error": error,
    })}
    {...props}
  />
);

export default CustomControl;
