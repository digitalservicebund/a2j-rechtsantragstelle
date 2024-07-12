import { useEffect, useState } from "react";
import { DataListType } from "~/services/cms/components/StrapiAutoSuggestInput";
import { DataListOptions } from "./getDataListOptions";

const DATA_LIST_API_PATH = "/data-list-options";

const useListOptions = (dataListType: DataListType["dataList"]) => {
  const [dataListOptions, setDataListOptions] = useState<DataListOptions[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${DATA_LIST_API_PATH}/${dataListType}`);
        const json = await response.json();
        setDataListOptions(json);
      } catch (error) {
        setDataListOptions([]);
      }
    };

    fetchData();
  }, [dataListType]);

  return dataListOptions;
};

export default useListOptions;
