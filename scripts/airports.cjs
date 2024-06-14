const airportData = require("airport-data-js");
const fs = require("fs");
const _ = require("lodash");
const countriesTranslation = require("i18n-iso-countries");

const germanLocale = "de";
const CITIES_AIRPORTS_DE = "scripts/cities_airports_de.csv";

const patchData = {
  iata: "VII",
  country_code: "VN",
  country: "Vietnam",
  airport: "Vinh International Flughafen",
  latitude: "18.7376",
  longitude: "105.671",
  city: "Vinh",
  continent: "AS",
};

const airportsGermanCitiesContent = fs.readFileSync(CITIES_AIRPORTS_DE, {
  encoding: "utf-8",
});

function translateAirportName(airportName) {
  // we cannot use .endWith() since the word airport is not always at the end
  // e.g  "San Rafael Airport (Argentina)"
  const airportIndex = airportName.toLowerCase().indexOf("airport");

  if (airportIndex !== -1) {
    return airportName.slice(0, airportIndex) + "Flughafen";
  }

  return airportName + " Flughafen";
}

function translateAirportCity(airport) {
  const rows = airportsGermanCitiesContent.split("\n");
  let city = airport.city;

  rows.forEach((row) => {
    const columns = row.split(",");
    if (airport.iata === columns[0]) {
      city = columns[2];
    }
  });

  return city;
}

function filteredLargeMediumAirports(airports) {
  return airports
    .filter(
      (airport) =>
        (airport.type === "large_airport" ||
          airport.type === "medium_airport") &&
        airport.scheduled_service === "TRUE",
    )
    .map((airport) => {
      if (airport.iata === "VII") {
        return patchData;
      }

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
        continent: airport.continent || "NR",
      };
    });
}

async function fetchAirportDataByContinent(continent) {
  const airports = await airportData.getAirportByContinent(continent);

  return filteredLargeMediumAirports(airports);
}

async function fetchAirportDataByCountry(country) {
  const airports = await airportData.getAirportByCountryCode(country);

  return filteredLargeMediumAirports(airports);
}

async function fetchAllAirports() {
  const southAmericaAirports = await fetchAirportDataByContinent("SA");
  const europaAirports = await fetchAirportDataByContinent("EU");
  const asiaAirports = await fetchAirportDataByContinent("AS");
  const africaAirports = await fetchAirportDataByContinent("AF");
  const oceaniaAirports = await fetchAirportDataByContinent("OC");
  const usAirports = await fetchAirportDataByCountry("US");
  const canadaAirports = await fetchAirportDataByCountry("CA");
  const mexicanAirports = await fetchAirportDataByCountry("MX");

  const airports = [];
  airports.push(...southAmericaAirports);
  airports.push(...europaAirports);
  airports.push(...asiaAirports);
  airports.push(...africaAirports);
  airports.push(...oceaniaAirports);
  airports.push(...usAirports);
  airports.push(...canadaAirports);
  airports.push(...mexicanAirports);

  return airports;
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
