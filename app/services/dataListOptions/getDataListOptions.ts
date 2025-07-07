import { type Params } from "react-router";
import airlines from "data/airlines/data.json";
import airports from "data/airports/data.json";
import type { DataListType } from "~/services/cms/components/StrapiAutoSuggestInput";
import { fetchStreetnamesForZipcode } from "~/services/gerichtsfinder/openPLZ";

export type DataListOptions = {
  value: string;
  label: string;
  subDescription?: string;
};

export async function getDataListOptions(
  dataListType?: DataListType,
  params?: Params<string>,
): Promise<DataListOptions[]> {
  switch (dataListType) {
    case "airlines": {
      return [...airlines].map((airline) => ({
        value: airline.iata,
        label: airline.name,
      }));
    }
    case "airports": {
      return [...airports]
        .sort((a, b) => a.city.localeCompare(b.city))
        .map((airport) => ({
          value: airport.iata,
          label: airport.airport.includes(airport.city)
            ? `${airport.airport} (${airport.iata})`
            : `${airport.city} ${airport.airport} (${airport.iata})`,
          subDescription: `${airport.city}, ${airport.country}`,
        }));
    }
    case "streetNames": {
      return await fetchStreetnamesForZipcode(params?.PLZ);
    }
    case undefined:
    default: {
      return [];
    }
  }
}
