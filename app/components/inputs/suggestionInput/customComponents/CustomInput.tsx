import { InputProps, components } from "react-select";
import { INPUT_CHAR_LIMIT } from "~/services/validation/inputlimits";
import { DataListOptions } from "../SuggestionInput";

const CustomInput = (props: InputProps<DataListOptions, false>) => (
  <components.Input {...props} maxLength={INPUT_CHAR_LIMIT} />
);

export default CustomInput;
