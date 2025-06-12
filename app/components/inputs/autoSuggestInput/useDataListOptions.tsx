import { useEffect, useState } from "react";
import type { DataListType } from "~/services/cms/components/StrapiAutoSuggestInput";
import type { DataListOptions } from "~/services/dataListOptions/getDataListOptions";

const API_PATH = "/api";

function getResourcePath(type: DataListType): string {
  switch (type) {
    case "airports":
      return `${API_PATH}/airports/list`;
    case "airlines":
      return `${API_PATH}/airlines/list`;
    default: {
      throw new Error(`Unhandled type: ${String(type)}`);
    }
  }
}

const useDataListOptions = (dataListType: DataListType) => {
  const [dataListOptions, setDataListOptions] = useState<DataListOptions[]>([]);
  const resourcePath = getResourcePath(dataListType);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(resourcePath);

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
  }, [resourcePath, dataListType]);

  return dataListOptions;
};

export default useDataListOptions;
