import { components, type ControlProps } from "react-select";
import type { DataListOptions } from "~/services/dataListOptions/getDataListOptions";

// Control component - KERN classes are applied via the classNames prop on Select
const AutoSuggestController = (
  props: ControlProps<DataListOptions, false>,
  isDisabled: boolean,
) => {
  return <components.Control {...props} isDisabled={isDisabled} />;
};

export default AutoSuggestController;
