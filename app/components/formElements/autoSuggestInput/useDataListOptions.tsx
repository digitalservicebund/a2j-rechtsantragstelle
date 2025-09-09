import { useEffect, useState } from "react";
import { type DataListType } from "~/services/cms/models/formElements/StrapiAutoSuggestInput";
import type { DataListOptions } from "~/services/dataListOptions/getDataListOptions";

const API_PATH = "/api";

function getResourcePath(
  type: DataListType,
  dataListArgument?: string,
): string {
  switch (type) {
    case "airports":
      return `${API_PATH}/airports/list`;
    case "airlines":
      return `${API_PATH}/airlines/list`;
    case "streetNames": {
      return `${API_PATH}/streetNames/list/${dataListArgument}`;
    }
    default: {
      throw new Error(`Unhandled type: ${String(type)}`);
    }
  }
}

const useDataListOptions = (
  dataListType: DataListType,
  dataListArgument?: string,
) => {
  const [dataListOptions, setDataListOptions] = useState<DataListOptions[]>([]);
  const resourcePath = getResourcePath(dataListType, dataListArgument);

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
