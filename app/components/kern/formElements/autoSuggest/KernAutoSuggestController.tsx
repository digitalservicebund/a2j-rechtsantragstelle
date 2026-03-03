import { components, type ControlProps } from "react-select";
import type { DataListOptions } from "~/services/dataListOptions/getDataListOptions";

// Control component - KERN classes are applied via the classNames prop on Select
const KernAutoSuggestController = (
  props: ControlProps<DataListOptions, false>,
) => {
  return <components.Control {...props} />;
};

export default KernAutoSuggestController;
