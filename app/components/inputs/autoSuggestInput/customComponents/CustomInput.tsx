import {
  components,
  type InputProps,
  type Props,
  type GroupBase,
} from "react-select";
import type { DataListOptions } from "~/services/dataListOptions/getDataListOptions";
import { INPUT_CHAR_LIMIT } from "~/services/validation/inputlimits";

//Will become obsolete with the next version bump: https://github.com/JedWatson/react-select/pull/6016
type CustomSelectProps = Props<
  DataListOptions,
  false,
  GroupBase<DataListOptions>
> & {
  "aria-describedby": string;
};

const CustomInput = (props: InputProps<DataListOptions, false>) => {
  const selectProps = props.selectProps as CustomSelectProps;
  return (
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
      aria-describedby={selectProps["aria-describedby"]}
      aria-required={props.selectProps.className?.includes(
        "auto-suggest-input-required",
      )}
    />
  );
};
export default CustomInput;
