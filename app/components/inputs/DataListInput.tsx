import type { DataListType } from "~/services/cms/components/StrapiAutoSuggestInput";
import { getDataListOptions } from "./autoSuggestInput/getDataListOptions";

type Props = Readonly<{
  inputName: string;
}> &
  Partial<DataListType>;

const DataListInput = ({ inputName, dataList }: Props) => {
  const dataListOptions = getDataListOptions(dataList);

  if (dataListOptions.length === 0) {
    return null;
  }

  return (
    <datalist id={`data-list-${inputName}`}>
      {dataListOptions.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </datalist>
  );
};

export default DataListInput;
