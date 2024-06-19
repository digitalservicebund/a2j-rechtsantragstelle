import fs from "fs";
import _ from "lodash";
import countriesTranslation from "i18n-iso-countries";

const germanLocale = "de";
const CITIES_AIRPORTS_DE = "scripts/cities_airports_de.csv";
const AIPORTS_URL_DATA_SOURCE =
  "https://davidmegginson.github.io/ourairports-data/airports.csv";

const airportsGermanCitiesContent = fs.readFileSync(CITIES_AIRPORTS_DE, {
  encoding: "utf-8",
});

type AiportDataSource = {
  iata: string;
  country_code: string;
  airport: string;
  latitude: string;
  longitude: string;
  city: string;
  type: string;
  scheduled_service: string;
};

type Aiport = Omit<AiportDataSource, "type" | "scheduled_service"> & {
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

function translateAirportCity(airport: AiportDataSource): string {
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

function filteredLargeMediumAirports(airports: AiportDataSource[]): Aiport[] {
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

function parseAiportDataSource(content: string): AiportDataSource[] {
  const rows = content.split("\n");
  const airports: AiportDataSource[] = [];
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

    if (typeof iataData !== "undefined" && iataData.length > 0) {
      airports.push({
        iata: iataData.replace(/["']/g, ""),
        country_code: country_codeData.replace(/["']/g, ""),
        airport: name.replace(/["']/g, ""),
        latitude: latitude,
        longitude: longitude,
        city: city.replace(/["']/g, ""),
        type: type.replace(/["']/g, ""),
        scheduled_service: scheduled_service.replace(/["']/g, ""),
      });
    }
  });

  return airports;
}

async function fetchAllAirports(): Promise<Aiport[]> {
  const res = await fetch(AIPORTS_URL_DATA_SOURCE, {
    headers: {
      "content-type": "text/csv;charset=UTF-8",
    },
  });

  if (res.status === 200) {
    const content = await res.text();
    const airportsDataSource = parseAiportDataSource(content);
    return filteredLargeMediumAirports(airportsDataSource);
  }

  console.log(`Error code ${res.status}`);
  return [];
}

async function fetchAndSaveAirports() {
  const airports = await fetchAllAirports();
  const data = JSON.stringify(_.uniqBy(airports, "iata"));
  const filePath = "data/airports/data.json";

  fs.writeFile(filePath, data, (error) => {
    if (error) {
      console.error(error);
      throw error;
    }
  });
  console.log(`${filePath} written correctly`);
}

fetchAndSaveAirports();
