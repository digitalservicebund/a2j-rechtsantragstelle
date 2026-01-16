import classNames from "classnames";
import { components, type ControlProps } from "react-select";
import type { DataListOptions } from "~/services/dataListOptions/getDataListOptions";

const KernAutoSuggestController = (
  props: ControlProps<DataListOptions, false>,
) => (
  <components.Control
    // className={classNames( "", {
    //   "has-error": props.selectProps.className?.includes("has-error"),
    //   "auto-suggest-input-disabled": props.selectProps.className?.includes(
    //     "auto-suggest-input-disabled",
    //   ),
    // })}
    className=""
    {...props}
  />
);

export default KernAutoSuggestController;
