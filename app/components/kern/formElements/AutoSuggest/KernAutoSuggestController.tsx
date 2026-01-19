import { components, type ControlProps } from "react-select";
import type { DataListOptions } from "~/services/dataListOptions/getDataListOptions";

const KernAutoSuggestController = (
  props: ControlProps<DataListOptions, false>,
) => (
  <components.Control
    {...props}
  />
);

export default KernAutoSuggestController;
