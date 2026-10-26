import { useEffect, useState, startTransition } from "react";
import { type DataListType } from "~/services/validation/autoSuggest";
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
    case "streetNames":
      return `${API_PATH}/streetNames/list/${dataListArgument}`;
    case "nationalities":
      return `${API_PATH}/nationalities/list`;
    case "countries":
      return `${API_PATH}/countries/list`;
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

  useEffect(() => {
    const controller = new AbortController();

    // In React 19, startTransition can take an async function directly
    startTransition(async () => {
      try {
        const resourcePath = getResourcePath(dataListType, dataListArgument);
        const response = await fetch(resourcePath, {
          signal: controller.signal,
        });

        if (!response.ok) {
          setDataListOptions([]);
          return;
        }

        const json = await response.json();
        setDataListOptions(Array.isArray(json) ? json : []);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          setDataListOptions([]);
        }
      }
    });

    return () => controller.abort();
  }, [dataListType, dataListArgument]); // Primitive dependencies prevent infinite loops

  return dataListOptions;
};

export default useDataListOptions;
