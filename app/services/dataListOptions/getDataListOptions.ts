import airlines from "data/airlines/data.json";
import airports from "data/airports/data.json";
import type { DataListType } from "~/services/cms/components/StrapiAutoSuggestInput";

export type DataListOptions = {
  value: string;
  label: string;
  subDescription?: string;
};

export function getDataListOptions(
  dataListType?: DataListType,
): DataListOptions[] {
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
    default: {
      return [];
    }
  }
}
