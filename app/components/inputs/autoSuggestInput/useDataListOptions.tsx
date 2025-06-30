import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import { type z } from "zod";
import { type adresseSchema } from "~/domains/shared/formular/persoenlicheDaten/userData";
import type { DataListType } from "~/services/cms/components/StrapiAutoSuggestInput";
import type { DataListOptions } from "~/services/dataListOptions/getDataListOptions";
import { fetchStreetnamesForZipcode } from "~/services/gerichtsfinder/openPLZ";

const API_PATH = "/api";

export type FetcherFunction = (args?: string) => Promise<DataListOptions[]>;

function getDataFetcher(
  type: DataListType,
  pathArgs?: string,
): FetcherFunction {
  if (type === "streetNames" && !pathArgs) {
    throw new Error(
      "Postleitzahl is undefined, but required to call the OpenPLZ API",
    );
  }
  switch (type) {
    case "airports":
      return async () => {
        const response = await fetch(`${API_PATH}/airports/list`);
        return response.ok ? await response.json() : [];
      };
    case "airlines":
      return async () => {
        const response = await fetch(`${API_PATH}/airlines/list`);
        return response.ok ? await response.json() : [];
      };
    case "streetNames":
      return fetchStreetnamesForZipcode;
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataFetcher = getDataFetcher(dataListType, postleitzahl);
        const options = await dataFetcher(postleitzahl);
        setDataListOptions(options);
      } catch (err: unknown) {
        // eslint-disable-next-line no-console
        console.error(err);
        setDataListOptions([]);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchData();
  }, [dataListType, postleitzahl]);

  return dataListOptions;
};

export default useDataListOptions;
