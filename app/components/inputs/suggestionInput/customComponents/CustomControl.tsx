import classNames from "classnames";
import { ControlProps, components } from "react-select";
import { DataListOptions } from "../SuggestionInput";

const CustomControl = (
  props: ControlProps<DataListOptions, false>,
  error?: string,
) => (
  <components.Control
    className={classNames("ds-select suggestion-input", { "has-error": error })}
    {...props}
  />
);

export default CustomControl;
