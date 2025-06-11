import { useEffect, useState } from "react";
import type { DataListType } from "~/services/cms/components/StrapiAutoSuggestInput";
import type { DataListOptions } from "~/services/dataListOptions/getDataListOptions";

const API_PATH = "/api";

const useDataListOptions = (dataListType: DataListType) => {
  const [dataListOptions, setDataListOptions] = useState<DataListOptions[]>([]);
  const FLUGGASTRECHTE_RESOURCE_PATH = `${API_PATH}/${dataListType}/list`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(FLUGGASTRECHTE_RESOURCE_PATH);

        if (response.ok) {
          const json = await response.json();
          setDataListOptions(json);
        }
      } catch {
        setDataListOptions([]);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchData();
  }, [FLUGGASTRECHTE_RESOURCE_PATH, dataListType]);

  return dataListOptions;
};

export default useDataListOptions;
