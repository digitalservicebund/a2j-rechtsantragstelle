import { components, type InputProps } from "react-select";
import type { DataListOptions } from "~/services/dataListOptions/getDataListOptions";
import { INPUT_CHAR_LIMIT } from "~/services/validation/inputlimits";

const CustomInput = (props: InputProps<DataListOptions, false>) => (
  <components.Input
    // avoid to clear the previous auto suggestion input when press enter
    // this cannot be tested, thus manually tested with device(s)
    onKeyDown={(e) => {
      if (e.key === "Enter" && !props.selectProps.menuIsOpen) {
        e.preventDefault();
      }
    }}
    {...props}
    maxLength={INPUT_CHAR_LIMIT}
  />
);

export default CustomInput;
