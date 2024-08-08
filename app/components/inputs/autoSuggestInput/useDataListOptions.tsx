import { useEffect, useState } from "react";
import { DataListType } from "~/services/cms/components/StrapiAutoSuggestInput";
import { DataListOptions } from "~/services/dataListOptions/getDataListOptions";

const DATA_LIST_API_PATH = "/data-list-options";

const useDataListOptions = (dataListType: DataListType) => {
  const [dataListOptions, setDataListOptions] = useState<DataListOptions[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${DATA_LIST_API_PATH}/${dataListType}`);

        if (response.ok) {
          const json = await response.json();
          setDataListOptions(json);
        }
      } catch {
        setDataListOptions([]);
      }
    };

    fetchData();
  }, [dataListType]);

  return dataListOptions;
};

export default useDataListOptions;
