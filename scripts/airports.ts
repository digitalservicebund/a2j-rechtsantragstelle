/* eslint-disable no-console */
import fs from "fs";
import countriesTranslation from "i18n-iso-countries";
import _ from "lodash";
import { z } from "zod";

const germanLocale = "de";
const CITIES_AIRPORTS_DE = "scripts/cities_airports_de.csv";
const AIRPORTS_URL_DATA_SOURCE =
  "https://davidmegginson.github.io/ourairports-data/airports.csv";

const airportsGermanCitiesContent = fs.readFileSync(CITIES_AIRPORTS_DE, {
  encoding: "utf-8",
});

function removeDoubleQuotes(value: unknown): string {
  if (typeof value === "string") {
    return value.replace(/["']/g, "");
  }

  return "";
}

const AirportDataSourceSchema = z.object({
  iata: z.string().trim().min(1).transform(removeDoubleQuotes),
  country_code: z.string().transform(removeDoubleQuotes),
  airport: z.string().transform(removeDoubleQuotes),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  city: z.string().transform(removeDoubleQuotes),
  type: z.string().transform(removeDoubleQuotes),
  scheduled_service: z.preprocess(
    (val) => removeDoubleQuotes(val),
    z.enum(["yes", "no"]),
  ),
});

type AirportDataSource = z.infer<typeof AirportDataSourceSchema>;

type Airport = Omit<AirportDataSource, "type" | "scheduled_service"> & {
  country: string;
};

function translateAirportName(airportName: string): string {
  // we cannot use .endWith() since the word airport is not always at the end
  // e.g  "San Rafael Airport (Argentina)"
  const airportIndex = airportName.toLowerCase().indexOf("airport");

  if (airportIndex !== -1) {
    return airportName.slice(0, airportIndex) + "Flughafen";
  }

  return airportName + " Flughafen";
}

function translateAirportCity(airport: AirportDataSource): string {
  const rows = airportsGermanCitiesContent.split("\n");
  let city = airport.city;

  rows.forEach((row) => {
    const [iata, , cityTranslation] = row.split(",");
    if (airport.iata === iata) {
      city = cityTranslation;
    }
  });

  return city;
}

function filteredLargeMediumAirports(airports: AirportDataSource[]): Airport[] {
  return airports
    .filter(
      (airport) =>
        (airport.type === "large_airport" ||
          airport.type === "medium_airport") &&
        airport.scheduled_service === "yes",
    )
    .map((airport) => {
      return {
        iata: airport.iata,
        country_code: airport.country_code,
        country:
          countriesTranslation.getName(airport.country_code, germanLocale) ??
          "",
        airport: translateAirportName(airport.airport),
        latitude: airport.latitude,
        longitude: airport.longitude,
        city: translateAirportCity(airport),
      };
    });
}

function parseAirportDataSource(content: string): AirportDataSource[] {
  const rows = content.split("\n");
  const airports: AirportDataSource[] = [];
  rows.slice(1).forEach((row) => {
    const [
      ,
      ,
      type,
      name,
      latitude,
      longitude,
      ,
      ,
      country_codeData,
      ,
      city,
      scheduled_service,
      ,
      iataData,
    ] = row.split(",");

    const airportData = {
      iata: iataData,
      country_code: country_codeData,
      airport: name,
      latitude: latitude,
      longitude: longitude,
      city: city,
      type: type,
      scheduled_service: scheduled_service,
    };

    const airportResult = AirportDataSourceSchema.safeParse(airportData);

    if (airportResult.success) {
      airports.push(airportResult.data);
    }
  });

  return airports;
}

async function fetchAllAirports(): Promise<Airport[]> {
  const res = await fetch(AIRPORTS_URL_DATA_SOURCE, {
    headers: {
      "content-type": "text/csv;charset=UTF-8",
    },
  });

  if (res.ok) {
    const content = await res.text();
    const airportsDataSource = parseAirportDataSource(content);
    return filteredLargeMediumAirports(airportsDataSource);
  }

  console.log(`Error code ${res.status}. Status text: ${res.statusText}`);
  return [];
}

async function fetchAndSaveAirports() {
  const airports = await fetchAllAirports();
  const data = JSON.stringify(_.uniqBy(airports, "iata"));
  const filePath = "data/airports/data.json";

  fs.writeFileSync(filePath, data);
  console.log(`${filePath} written correctly`);
}

fetchAndSaveAirports();
