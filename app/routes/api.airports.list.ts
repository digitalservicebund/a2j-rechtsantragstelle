import { getDataListOptions } from "~/services/dataListOptions/getDataListOptions";

export function loader() {
  return getDataListOptions("airports");
}
