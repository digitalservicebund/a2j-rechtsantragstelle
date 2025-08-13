import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import { type z } from "zod";
import { type adresseSchema } from "~/domains/shared/formular/persoenlicheDaten/userData";
import { type DataListType } from "~/services/cms/models/formElements/StrapiAutoSuggestInput";
import type { DataListOptions } from "~/services/dataListOptions/getDataListOptions";

const API_PATH = "/api";

function getResourcePath(type: DataListType, routeArgs?: string): string {
  switch (type) {
    case "airports":
      return `${API_PATH}/airports/list`;
    case "airlines":
      return `${API_PATH}/airlines/list`;
    case "streetNames": {
      return `${API_PATH}/streetNames/list/${routeArgs}`;
    }
    default: {
      throw new Error(`Unhandled type: ${String(type)}`);
    }
  }
}

const useDataListOptions = (dataListType: DataListType) => {
  const [dataListOptions, setDataListOptions] = useState<DataListOptions[]>([]);
  /**
   * In the case of the Gerichtsfinder, we need the previously-selected PLZ to fetch the street names.
   * However, the AutoSuggest can also be used in a Vorabcheck, so it's not possible to discern the loaderData ahead of time
   */
  const loaderData = useLoaderData();
  const postleitzahl = loaderData?.prunedUserData?.plz as
    | z.infer<typeof adresseSchema.plz>
    | undefined;
  const resourcePath = getResourcePath(dataListType, postleitzahl);

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
