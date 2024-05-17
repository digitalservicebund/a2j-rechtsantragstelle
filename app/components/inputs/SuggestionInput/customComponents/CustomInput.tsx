import { InputProps, components } from "react-select";
import { DataListOptions } from "../SuggestionInput";
import { INPUT_CHAR_LIMIT } from "~/services/validation/inputlimits";

const CustomInput = (props: InputProps<DataListOptions, false>) => (
  <components.Input {...props} maxLength={INPUT_CHAR_LIMIT} />
);

export default CustomInput;
